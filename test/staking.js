const web3 = require('web3');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

const {
  stakeAndVerifyBalances,
  verifyBalances,
  verifyUnlockedAt,
  buildBytesInput,
  sub,
  calculateBalances,
  verifyEventLog,
} = require('./utils');

const { toWei } = web3.utils;

let staker;
let StakingContract;
let TRST;


// Matrix:
// [
// [data, expectedUnlockedAt]
// ]
const runSanityMatrix = (matrix) => {
  for (const payload of matrix) {
    it(`Test stake/unstake with payload ${payload[0]}`, async () => {
      const amount = toWei('1', 'gwei'); // 1000 TRST

      const balances = await stakeAndVerifyBalances(
        staker, amount, payload[0], TRST, StakingContract,
      );

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);

      const res = await StakingContract.unstake(amount, payload[0], { from: staker });

      // verify amounts in log event
      verifyEventLog(
        res, 'Unstaked', [staker, amount, 0, payload[0]],
      );

      // verify all the balances are the same as the very beginning
      await verifyBalances(balances.before, staker, payload[0], TRST, StakingContract);

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);
    });

    it(`Test stake/unstake with payload ${payload[0]} twice`, async () => {
      const amount1 = toWei('1', 'gwei'); // 1000 TRST
      const amount2 = toWei('2', 'gwei');

      // stake the same payload twice with different amount
      const balances1 = await stakeAndVerifyBalances(
        staker, amount1, payload[0], TRST, StakingContract,
      );

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);

      const balances2 = await stakeAndVerifyBalances(
        staker, amount2, payload[0], TRST, StakingContract,
      );

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);

      // unstake once
      // sum(amoount1, amount2) = sum(amount3, amount4)
      const amount3 = toWei('1.3', 'gwei');
      const amount4 = toWei('1.7', 'gwei');
      let res = await StakingContract.unstake(amount3, payload[0], { from: staker });

      // verify amounts in log event
      // amount4 is what they have left
      verifyEventLog(
        res, 'Unstaked', [staker, amount3, amount4, payload[0]],
      );

      // verify intermediary balances
      const balances3 = calculateBalances(balances2.after, sub, amount3);
      await verifyBalances(balances3, staker, payload[0], TRST, StakingContract);

      // unstake twice
      res = await StakingContract.unstake(amount4, payload[0], { from: staker });

      // verify amounts in log event
      verifyEventLog(
        res, 'Unstaked', [staker, amount4, 0, payload[0]],
      );

      // verify all the balances are the same as the very beginning
      await verifyBalances(balances1.before, staker, payload[0], TRST, StakingContract);

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);
    });

    it(`Test if no stake, the unstake fails with payload ${payload[0]}`, async () => {
      const amount = toWei('0.1', 'gwei');
      try {
        await StakingContract.unstake(amount, payload[0], { from: staker });
      } catch (e) {
        assert(e.toString().includes('Amount must be equal or smaller than the record.'));
        return;
      }
      assert.fail('Not supposed to reach here');
    });
  }
};

before(async () => {
  StakingContract = await TimeLockedStaking.deployed();
  TRST = await TRSTArtifact.deployed();
});

contract('should be able to stake and unstake and balance is transfered correctly', (accounts) => {
  [staker] = accounts;
  const now = Math.floor(Date.now() / 1000);

  // Matrix:
  // [
  // [data, expectedUnlockedAt]
  // ]
  runSanityMatrix([
    ['0x', 1],
    ['0x0', 1],
    ['0x1', 1],
    ['0x00', 1],
    ['0x01', 1],
    ['0x001', 1],
    [buildBytesInput('0'), 1],
    [buildBytesInput('1'), 1],
    [buildBytesInput('2'), 2],
    [buildBytesInput(String(now)), now],
    [buildBytesInput('2', '0'), 2],
    [buildBytesInput(String(now), '0'), now],
    [buildBytesInput('2', '1'), 2],
    [buildBytesInput(String(now), '1'), now],
    [buildBytesInput('2', '1', [64, 128]), 2],
    [buildBytesInput(String(now), '1', [64, 128]), now],
  ]);
});

contract('Staking Sanity', (accounts) => {
  [staker] = accounts;

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

  it('should return supportsHistory false', async () => {
    const isSupportsHistory = await StakingContract.supportsHistory();
    assert.equal(isSupportsHistory, false);
  });
});
