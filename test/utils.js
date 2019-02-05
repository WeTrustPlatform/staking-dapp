const web3 = require('web3');

const { toBN } = web3.utils;

const getTRSTBalance = async (contract, address) => toBN(await contract.balanceOf(address));

const getTotalStakedFor = async (contract, address) => toBN(await contract.totalStakedFor(address));

const getTotalStaked = async contract => toBN(
  await contract.totalStaked(),
);

const add = (a, b) => toBN(a).add(toBN(b));
const sub = (a, b) => toBN(a).sub(toBN(b));
const inv = op => (op.toString() === add.toString() ? sub : add);

const verifyBalances = async (expectedBalances, staker, TRST, StakingContract) => {
  const {
    contractTotalStaked,
    stakerStakeAmount,
    contractTRSTBalance,
    stakerTRSTBalance,
  } = expectedBalances;

  const stakingContractAddress = StakingContract.address;

  assert.deepEqual(
    await getTotalStaked(StakingContract),
    contractTotalStaked,
  );
  assert.deepEqual(
    await getTotalStakedFor(StakingContract, staker),
    stakerStakeAmount,
  );
  assert.deepEqual(
    await getTRSTBalance(TRST, stakingContractAddress),
    contractTRSTBalance,
  );
  assert.deepEqual(
    await getTRSTBalance(TRST, staker),
    stakerTRSTBalance,
  );
};

const calculateBalances = (balances, op, amount) => {
  const calculateAmountAfter = (subject, fn) => fn(subject, amount);

  const contractTotalStaked = calculateAmountAfter(balances.contractTotalStaked, op);
  const contractTRSTBalance = calculateAmountAfter(balances.contractTRSTBalance, op);
  const stakerStakeAmount = calculateAmountAfter(balances.stakerStakeAmount, op);
  const stakerTRSTBalance = calculateAmountAfter(balances.stakerTRSTBalance, inv(op));

  return {
    contractTotalStaked,
    contractTRSTBalance,
    stakerStakeAmount,
    stakerTRSTBalance,
  };
};

// Every staking should re-use this method
// verify all the balances at each step
// 1. get initial balances
// 2. approve TRST transfer
// 3. verify all balances
// 4. stake
// 5. verify all balances
// 6. return balances info before and after
const stakeAndVerifyBalances = async (staker, amountInWei, data, TRST, StakingContract) => {
  const amount = toBN(amountInWei);

  const stakingContractAddress = StakingContract.address;

  const stakerOriginalTRSTBalance = await getTRSTBalance(TRST, staker);
  const stakerOriginalStakeAmount = await getTotalStakedFor(StakingContract, staker);

  const contractOriginalTRSTBalance = await getTRSTBalance(TRST, stakingContractAddress);
  const contractOriginalTotalStaked = await getTotalStaked(StakingContract);

  // approve TRST transfer before staking
  await TRST.approve(stakingContractAddress, amount.toString(), { from: staker });

  // make sure all balances are correct at this state
  assert.deepEqual(await getTotalStaked(StakingContract), contractOriginalTotalStaked);
  assert.deepEqual(await getTotalStakedFor(StakingContract, staker), stakerOriginalStakeAmount);
  assert.deepEqual(await getTRSTBalance(TRST, stakingContractAddress), contractOriginalTRSTBalance);
  assert.deepEqual(await getTRSTBalance(TRST, staker), stakerOriginalTRSTBalance);

  await StakingContract.stake(amount.toString(), data, { from: staker });


  const balancesBefore = {
    stakerStakeAmount: stakerOriginalStakeAmount,
    stakerTRSTBalance: stakerOriginalTRSTBalance,
    contractTotalStaked: contractOriginalTotalStaked,
    contractTRSTBalance: contractOriginalTRSTBalance,
  };

  // verify all the new balances
  const balancesAfter = calculateBalances(balancesBefore, add, amount);
  await verifyBalances(balancesAfter, staker, TRST, StakingContract);

  return {
    before: balancesBefore,
    after: balancesAfter,
  };
};

const verifyUnlockedAt = async (staker, data, expectedUnlockedAt, StakingContract) => {
  const unlockedAt = await StakingContract.getStakeRecordUnlockedAt(staker, data);
  assert.equal(unlockedAt.toNumber(), expectedUnlockedAt);
};

/**
 * Pad 0 to a numberString
 * @param numberString Positive integer number in string format
 * @param padSize Number of characters. Default: 64 characters = 32 bytes
 */
const paddedBytes = (numberString, padSize = 64) => {
  const { utils } = web3;
  const hex = utils.toHex(numberString);
  const padded = utils.padLeft(hex, padSize);
  return utils.hexToBytes(padded);
};

/**
 * Build stake payload from timeSignal and voteSignal
 * @param timeSignal Locked in duration in seconds
 * @param voteSignal Any number in string. It is emitted in the event log
 * but not stored
 * @param padSize Array of 2 which determine the size of timeSignal and voteSignal
 * respectively. This is used for testing only. Otherwise, leave it as defaul.
 * Default [64, 64]
 */
const buildBytesInput = (timeSignal, voteSignal, padSize = [64, 64]) => {
  const paddedTimeSignal = paddedBytes(timeSignal, padSize[0]);
  const data = voteSignal
    ? paddedTimeSignal.concat(paddedBytes(voteSignal, padSize[1]))
    : paddedTimeSignal;
  const hex = web3.utils.bytesToHex(data);
  return hex;
};

module.exports = {
  getTRSTBalance,
  getTotalStakedFor,
  getTotalStaked,
  stakeAndVerifyBalances,
  add,
  sub,
  calculateBalances,
  paddedBytes,
  buildBytesInput,
  verifyBalances,
  verifyUnlockedAt,
};
