const web3 = require('web3');

const { toBN, hexToNumberString } = web3.utils;

const getTRSTBalance = async (contract, address) => toBN(await contract.balanceOf(address));

const getTotalStakedFor = async (contract, address) => toBN(await contract.totalStakedFor(address));

const getTotalStaked = async contract => toBN(
  await contract.totalStaked(),
);

const getStakerRecordAmount = async (
  contract, staker, data,
) => toBN(await contract.getStakeRecordAmount(staker, data));

// i.e. operation to the balance when stake
const deposit = (a, b) => toBN(a).add(toBN(b));
// i.e. operation to the balance when unstake
const withdraw = (a, b) => toBN(a).sub(toBN(b));
const reverse = operation => (operation.toString() === deposit.toString()
  ? withdraw : deposit);

// get all the posible balances from smart contracts
// i.e.
// contractTotalStaked,
// contractTRSTBalance,
// stakerStakeAmount,
// stakerTRSTBalance,
// stakerRecordAmount,
//
const getCurrentBalances = async (staker, data, TRST, StakingContract) => {
  const stakingContractAddress = StakingContract.address;

  const stakerTRSTBalance = await getTRSTBalance(TRST, staker);
  const stakerStakeAmount = await getTotalStakedFor(StakingContract, staker);

  const contractTRSTBalance = await getTRSTBalance(TRST, stakingContractAddress);
  const contractTotalStaked = await getTotalStaked(StakingContract);

  const stakerRecordAmount = await getStakerRecordAmount(
    StakingContract, staker, data,
  );

  return {
    contractTotalStaked,
    contractTRSTBalance,
    stakerStakeAmount,
    stakerTRSTBalance,
    stakerRecordAmount,
  };
};

// get the latest balances from contracts
// and verify the expectedBalances
const verifyBalances = async (expectedBalances, staker, data, TRST, StakingContract) => {
  const actualBalances = await getCurrentBalances(staker, data, TRST, StakingContract);

  assert.equal(
    Object.keys(expectedBalances).length,
    Object.keys(actualBalances).length,
  );

  for (const key of Object.keys(actualBalances)) {
    const actual = actualBalances[key];
    const expected = expectedBalances[key];
    assert(
      actual.eq(expected),
      `${key} is wrong. Actual ${actual} - Expected ${expected}`,
    );
  }
};

// there are 2^2 cases: operation x hasBeneficary
// operation: either deposit (stake) or withdraw (unstake) to/from Staking contract
// hasBeneficiary: either true or false that indicate stakeFor vs. stake
const calculateBalances = (balances, operation, amount, hasBeneficiary) => {
  // independent of hasBeneficary
  const contractTotalStaked = operation(balances.contractTotalStaked, amount);
  const contractTRSTBalance = operation(balances.contractTRSTBalance, amount);

  // staking for other has no effect
  const stakerStakeAmount = hasBeneficiary
    ? toBN(balances.stakerStakeAmount)
    : operation(balances.stakerStakeAmount, amount);

  const stakerRecordAmount = hasBeneficiary
    ? toBN(balances.stakerRecordAmount)
    : operation(balances.stakerRecordAmount, amount);

  let stakerTRSTBalance;

  if (hasBeneficiary && operation.toString() === withdraw.toString()) {
    // unstaking by other has no effect
    stakerTRSTBalance = toBN(balances.stakerTRSTBalance);
  } else {
    // staking for either self or other means withdraw self's TRST
    // unstaking for self means getting back more TRST i.e deposit
    stakerTRSTBalance = reverse(operation)(balances.stakerTRSTBalance, amount);
  }

  return {
    contractTotalStaked,
    contractTRSTBalance,
    stakerStakeAmount,
    stakerTRSTBalance,
    stakerRecordAmount,
  };
};


/**
 * Verify the event log for 'Staked' and 'Unstaked' only
 * @param res Response from contract call i.e. const res = await Contract.method()
 * @param logEvent Name of the event i.e. 'Staked'
 * @param logArgs Expected value of user, amount, totalAmount, data in an Array
 */
const verifyEventLog = (res, logEvent, logArgs) => {
  const { event, args } = res.logs[0];
  // cannot do this because args is not iterable
  // const [user, amount, totalAmount, data] = args;
  assert.equal(event, logEvent);
  assert.equal(args[0], logArgs[0]);
  assert.equal(args[1].toString(), logArgs[1].toString());
  assert.equal(args[2].toString(), logArgs[2].toString());
  assert.equal(
    // data || '0x' because when input payload is 0x, data is null
    // use hexToNumberString to solve the issue when
    // input is 0x1, data becomes 0x01
    hexToNumberString(args[3] || '0x'),
    hexToNumberString(logArgs[3]),
  );
};


// Every staking should re-use this method
// verify all the balances at each step
// 1. get initial balances
// 2. approve TRST transfer
// 3. verify all balances
// 4. stake
// 5. verify event log
// 5. verify all balances
// 6. return balances info before and after
const stakeAndVerifyBalances = async (staker, amountInWei, data, TRST, StakingContract) => {
  // use BN for comparision
  const amount = toBN(amountInWei);

  const balancesBefore = await getCurrentBalances(staker, data, TRST, StakingContract);

  const stakingContractAddress = StakingContract.address;
  // approve TRST transfer before staking
  await TRST.approve(stakingContractAddress, amount.toString(), { from: staker });

  // make sure balances have not changed
  await verifyBalances(balancesBefore, staker, data, TRST, StakingContract);

  const res = await StakingContract.stake(amount.toString(), data, { from: staker });

  // add the amount to balancesBefore
  const balancesAfter = calculateBalances(balancesBefore, deposit, amount, false);

  // verify all the new balances
  await verifyBalances(balancesAfter, staker, data, TRST, StakingContract);

  // verify log event
  verifyEventLog(
    res,
    'Staked',
    [
      staker,
      amount,
      balancesAfter.stakerStakeAmount,
      data,
    ],
  );

  return {
    before: balancesBefore,
    after: balancesAfter,
  };
};

// Same as stakeAndVerifyBalances
const unstakeAndVerifyBalances = async (staker, amountInWei, data, TRST, StakingContract) => {
  const amount = toBN(amountInWei);
  const balancesBefore = await getCurrentBalances(staker, data, TRST, StakingContract);

  const res = await StakingContract.unstake(amount.toString(), data, { from: staker });

  // subtract the amount from before
  const balancesAfter = calculateBalances(balancesBefore, withdraw, amount, false);

  await verifyBalances(balancesAfter, staker, data, TRST, StakingContract);

  verifyEventLog(
    res,
    'Unstaked',
    [
      staker,
      amount,
      balancesAfter.stakerStakeAmount,
      data,
    ],
  );

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
  getCurrentBalances,
  stakeAndVerifyBalances,
  unstakeAndVerifyBalances,
  deposit,
  withdraw,
  calculateBalances,
  paddedBytes,
  buildBytesInput,
  verifyBalances,
  verifyUnlockedAt,
  verifyEventLog,
};
