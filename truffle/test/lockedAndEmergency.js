const {
  stakeAndVerifyBalances,
  unstakeAndVerifyBalances,
  buildBytesInput,
  now,
} = require('./utils');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
const amount = '1';

contract('Stake with future unlockedAt and emergency', ([staker]) => {
  let TRST;
  let StakingContract;

  beforeEach(async () => {
    // Deploy new set of contracts so that emergency flag and balance
    // do not affect other tests
    TRST = await TRSTArtifact.new(staker);
    StakingContract = await TimeLockedStaking.new(TRST.address, staker);
  });

  it('should fail to unstake due to unlockedAt. Then succeed in emergency', async () => {
    const data = buildBytesInput(now + now); // very far in the future

    await stakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
    try {
      await StakingContract.unstake(amount, data, { from: staker });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('This stake is still locked.'), `Error message does not match ${e}`);
      await StakingContract.setEmergency(true);
      await unstakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
      return;
    }
    assert.fail('Not supposed to reach here');
  });

  it('should fail to unstake due to unlockedAt. Then succeed after passing the unlockedAt', async () => {
    const lockedDuration = 5; // seconds
    const data = buildBytesInput(now + lockedDuration);

    await stakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
    try {
      await StakingContract.unstake(amount, data, { from: staker });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('This stake is still locked.'), `Error message does not match ${e}`);
      await sleep(lockedDuration);
      await unstakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
    }
  });

  it('should succeed to stake. Then fail in emergency', async () => {
    const data = '0x';
    await stakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
    await StakingContract.setEmergency(true);
    try {
      await StakingContract.stake(amount, data, { from: staker });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('Cannot stake due to emergency.'));
    }
  });
});
