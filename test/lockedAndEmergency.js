const {
  stakeAndVerifyBalances,
  unstakeAndVerifyBalances,
  buildBytesInput,
  now,
} = require('./utils');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

let StakingContract;
let TRST;

beforeEach(async () => {
  TRST = await TRSTArtifact.deployed();
  // Deploy new contracts so that emergency flag does not affect other tests
  StakingContract = await TimeLockedStaking.new(TRST.address);
});

const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));
const amount = '1';

contract('Stake with time locked', (accounts) => {
  const [staker] = accounts;

  it('should fail to unstake. Then succeed in emergency', async () => {
    const data = buildBytesInput(now + now); // very far in the future

    await stakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
    try {
      await StakingContract.unstake(amount, data, { from: staker });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('This stake is still locked.'));
      await StakingContract.setEmergency(true);
      await unstakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
      return;
    }
    assert.fail('Not supposed to reach here');
  });

  it('should fail to unstake. Then succeed after passing the unlockedAt', async () => {
    const lockedDuration = 3; // seconds
    const data = buildBytesInput(now + lockedDuration);

    await stakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
    try {
      await StakingContract.unstake(amount, data, { from: staker });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('This stake is still locked.'));
      await sleep(lockedDuration);
      await unstakeAndVerifyBalances(staker, amount, data, TRST, StakingContract);
    }
  });
});

contract('Stake with emergency', (accounts) => {
  const [staker] = accounts;

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
