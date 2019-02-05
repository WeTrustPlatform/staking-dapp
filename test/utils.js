const web3 = require('web3');

const { toBN } = web3.utils;

const getTRSTBalance = async (contract, address) => toBN(await contract.balanceOf(address));

const getTotalStakedFor = async (contract, address) => toBN(await contract.totalStakedFor(address));

const getTotalStaked = async contract => toBN(
  await contract.totalStaked(),
);

const getStakeRecordAmount = async (
  contract, staker, data,
) => toBN(await contract.getStakeRecordAmount(staker, data));

const add = (a, b) => toBN(a).add(toBN(b));
const sub = (a, b) => toBN(a).sub(toBN(b));
const inv = op => (op.toString() === add.toString() ? sub : add);

const verifyBalances = async (expectedBalances, staker, data, TRST, StakingContract) => {
  const {
    contractTotalStaked,
    stakerStakeAmount,
    contractTRSTBalance,
    stakerTRSTBalance,
    stakeRecordAmount,
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
  assert.deepEqual(
    await getStakeRecordAmount(StakingContract, staker, data),
    stakeRecordAmount,
  );
};

const calculateBalances = (balances, op, amount) => {
  const calculateAmountAfter = (subject, fn) => fn(subject, amount);

  const contractTotalStaked = calculateAmountAfter(balances.contractTotalStaked, op);
  const contractTRSTBalance = calculateAmountAfter(balances.contractTRSTBalance, op);
  const stakerStakeAmount = calculateAmountAfter(balances.stakerStakeAmount, op);
  const stakerTRSTBalance = calculateAmountAfter(balances.stakerTRSTBalance, inv(op));
  const stakeRecordAmount = calculateAmountAfter(balances.stakeRecordAmount, op);

  return {
    contractTotalStaked,
    contractTRSTBalance,
    stakerStakeAmount,
    stakerTRSTBalance,
    stakeRecordAmount,
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

  const stakerOriginalStakeRecordAmount = await getStakeRecordAmount(StakingContract, staker, data);

  // approve TRST transfer before staking
  await TRST.approve(stakingContractAddress, amount.toString(), { from: staker });

  // make sure all balances are correct at this state
  const balancesBefore = {
    stakerStakeAmount: stakerOriginalStakeAmount,
    stakerTRSTBalance: stakerOriginalTRSTBalance,
    contractTotalStaked: contractOriginalTotalStaked,
    contractTRSTBalance: contractOriginalTRSTBalance,
    stakeRecordAmount: stakerOriginalStakeRecordAmount,
  };
  await verifyBalances(balancesBefore, staker, data, TRST, StakingContract);

  await StakingContract.stake(amount.toString(), data, { from: staker });

  // verify all the new balances
  const balancesAfter = calculateBalances(balancesBefore, add, amount);
  await verifyBalances(balancesAfter, staker, data, TRST, StakingContract);

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
