const web3 = require('web3');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

const {
  stakeAndVerify,
  getTotalStakedFor,
  getTotalStaked,
  getTrstBalance,
} = require('./utils');

contract('Staking Sanity', (accounts) => {
  const trstHolder = accounts[0];
  let StakingContract;
  let TRST;

  before(async () => {
    StakingContract = await TimeLockedStaking.deployed();
    TRST = await TRSTArtifact.deployed();
  });

  it('should accept an address in the constructor', async () => {
    const erc20 = await StakingContract.token();
    assert.strictEqual(erc20, TRST.address);
  });

  it('should return correct supportsInterface', async () => {
    const eip165 = await StakingContract.supportsInterface('0x01ffc9a7');
    assert.ok(eip165);
    const eip900 = await StakingContract.supportsInterface('0x8efdf8ee');
    assert.ok(eip900);
    const invalid = await StakingContract.supportsInterface('0xffffffff');
    assert.ok(!invalid);
  });

  it('should be able to stake and unstake and balance is transfered correctly', async () => {
    const amount = web3.utils.toWei('1', 'gwei'); // 1000 TRST
    const stakingContractAddress = StakingContract.address;

    const balances = await stakeAndVerify(trstHolder, amount, '0x', TRST, StakingContract);

    await StakingContract.unstake(amount, '0x', { from: trstHolder });

    // verify all the balances are the same as the very beginning
    const {
      contractTotalStaked,
      stakerStakeAmount,
      contractTrstBalance,
      stakerTrstBalance,
    } = balances.before;

    assert.deepEqual(
      await getTotalStaked(StakingContract),
      contractTotalStaked,
    );
    assert.deepEqual(
      await getTotalStakedFor(StakingContract, trstHolder),
      stakerStakeAmount,
    );
    assert.deepEqual(
      await getTrstBalance(TRST, stakingContractAddress),
      contractTrstBalance,
    );
    assert.deepEqual(
      await getTrstBalance(TRST, trstHolder),
      stakerTrstBalance,
    );
  });

  it('should return supportsHistory false', async () => {
    const isSupportsHistory = await StakingContract.supportsHistory();
    assert.equal(isSupportsHistory, false);
  });
});
