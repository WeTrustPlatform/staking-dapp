const web3 = require('web3');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

const {
  stakeAndVerifyBalances,
  unstakeAndVerifyBalances,
  verifyUnlockedAt,
  buildBytesInput,
  now,
} = require('./utils');

const { toWei } = web3.utils;

let StakingContract;
let TRST;

// Matrix:
// [
// [data, expectedUnlockedAt]
// ]
const runSanityMatrix = (matrix, staker) => {
  for (const payload of matrix) {
    it(`should stake and unstake. Payload ${payload[0]}`, async () => {
      const amount = toWei('1', 'gwei'); // 1000 TRST

      await stakeAndVerifyBalances(
        staker, amount, payload[0], TRST, StakingContract,
      );

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);

      await unstakeAndVerifyBalances(
        staker, amount, payload[0], TRST, StakingContract,
      );

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);
    });

    it(`should stake and unstake twice. Payload ${payload[0]}`, async () => {
      const amount1 = toWei('1', 'gwei'); // 1000 TRST
      const amount2 = toWei('2', 'gwei');

      // stake the same payload twice with different amount
      await stakeAndVerifyBalances(
        staker, amount1, payload[0], TRST, StakingContract,
      );

      await stakeAndVerifyBalances(
        staker, amount2, payload[0], TRST, StakingContract,
      );

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);

      // unstake twice
      // sum(amoount1, amount2) = sum(amount3, amount4)
      const amount3 = toWei('1.3', 'gwei');
      const amount4 = toWei('1.7', 'gwei');

      await unstakeAndVerifyBalances(
        staker, amount3, payload[0], TRST, StakingContract,
      );

      await unstakeAndVerifyBalances(
        staker, amount4, payload[0], TRST, StakingContract,
      );

      await verifyUnlockedAt(staker, payload[0], payload[1], StakingContract);
    });

    it(`should fail to unstake when no stake. Payload ${payload[0]}`, async () => {
      const amount = toWei('0.1', 'gwei');
      try {
        await StakingContract.unstake(amount, payload[0], { from: staker });
        assert.fail('Not supposed to reach here');
      } catch (e) {
        assert(e.toString().includes('Amount must be equal or smaller than the record.'));
      }
    });
  }
};

contract('Test stake and unstake. Check balance is transfered correctly', ([staker]) => {
  before(async () => {
    // deploy new TRST to make sure staker has balance and it's not affected by other tests
    TRST = await TRSTArtifact.new(staker);
    // new staking contract with new TRST address
    StakingContract = await TimeLockedStaking.new(TRST.address, staker);
  });

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
  ], staker);
});
