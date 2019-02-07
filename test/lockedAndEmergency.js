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

contract('Only owner can change emergency status', (accounts) => {
  const [owner, nonOwner, nonDefault] = accounts;

  // deploy new contract to explicitly specify the contract's owner
  //
  it('should throw if nonOwner calls setEmergency', async () => {
    const contract = await TimeLockedStaking.new(TRST.address, { from: owner });
    const actualOwner = await contract.owner();
    assert.notEqual(actualOwner, nonOwner);
    assert.equal(actualOwner, owner);
    try {
      await contract.setEmergency(true, { from: nonOwner });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('msg.sender must be owner.'));
    }
  });

  it('should change the emergency', async () => {
    const contract = await TimeLockedStaking.new(TRST.address, { from: nonDefault });
    // turn on
    await contract.setEmergency(true, { from: nonDefault });
    let emergency = await contract.emergency();
    assert(emergency);

    // turn off
    await contract.setEmergency(false, { from: nonDefault });
    emergency = await contract.emergency();
    assert(!emergency);
  });
});
