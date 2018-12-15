const web3 = require('web3');

const { toBN } = web3.utils;

const getTrstBalance = async (contract, address) => toBN(await contract.balanceOf(address));

const getTotalStakedFor = async (contract, address) => toBN(await contract.totalStakedFor(address));

const getTotalStaked = async contract => toBN(
  await contract.totalStaked(),
);

const add = (a, b) => toBN(a).add(toBN(b));
const sub = (a, b) => toBN(a).sub(toBN(b));

const calculateAmountAfter = amount => (subject, op) => op(subject, amount);

// Every staking should re-use this method
// verify all the balances at each step
// 1. get initial balances
// 2. approve TRST transfer
// 3. verify all balances
// 4. stake
// 5. verify all balances
// 6. return balances info before and after
const stakeAndVerify = async (staker, amountInWei, data, TRST, StakingContract) => {
  const amount = toBN(amountInWei);

  const stakingContractAddress = StakingContract.address;

  const stakerOriginalTrstBalance = await getTrstBalance(TRST, staker);
  const stakerOriginalStakeAmount = await getTotalStakedFor(StakingContract, staker);

  const contractOriginalTrstBalance = await getTrstBalance(TRST, stakingContractAddress);
  const contractOriginalTotalStaked = await getTotalStaked(StakingContract);

  // approve TRST transfer before staking
  await TRST.approve(stakingContractAddress, amount.toString(), { from: staker });

  // make sure all balances are correct at this state
  assert.deepEqual(await getTotalStaked(StakingContract), contractOriginalTotalStaked);
  assert.deepEqual(await getTotalStakedFor(StakingContract, staker), stakerOriginalStakeAmount);
  assert.deepEqual(await getTrstBalance(TRST, stakingContractAddress), contractOriginalTrstBalance);
  assert.deepEqual(await getTrstBalance(TRST, staker), stakerOriginalTrstBalance);

  await StakingContract.stake(amount.toString(), data, { from: staker });

  // verify all the new balances
  const amountAfter = calculateAmountAfter(amount);

  const contractTotalStaked = amountAfter(contractOriginalTotalStaked, add);
  const contractTrstBalance = amountAfter(contractOriginalTrstBalance, add);
  const stakerStakeAmount = amountAfter(stakerOriginalStakeAmount, add);
  const stakerTrstBalance = amountAfter(stakerOriginalTrstBalance, sub);

  assert.deepEqual(
    await getTotalStaked(StakingContract),
    contractTotalStaked,
  );
  assert.deepEqual(
    await getTotalStakedFor(StakingContract, staker),
    stakerStakeAmount,
  );
  assert.deepEqual(
    await getTrstBalance(TRST, stakingContractAddress),
    contractTrstBalance,
  );
  assert.deepEqual(
    await getTrstBalance(TRST, staker),
    stakerTrstBalance,
  );

  return {
    before: {
      stakerStakeAmount: stakerOriginalStakeAmount,
      stakerTrstBalance: stakerOriginalTrstBalance,
      contractTotalStaked: contractOriginalTotalStaked,
      contractTrstBalance: contractOriginalTrstBalance,
    },
    after: {
      stakerStakeAmount,
      stakerTrstBalance,
      contractTotalStaked,
      contractTrstBalance,
    },
  };
};

const paddedBytes = (numberString, padSize = 32) => {
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
 * Default [32, 32]
 */
const buildBytesInput = (timeSignal, voteSignal, padSize = [32, 32]) => {
  const paddedTimeSignal = paddedBytes(timeSignal, padSize[0]);
  const paddedVoteSignal = paddedBytes(voteSignal, padSize[1]);
  const data = paddedBytes('0').concat(paddedTimeSignal, paddedVoteSignal);
  const hex = web3.utils.bytesToHex(data);
  return hex;
};

module.exports = {
  getTrstBalance,
  getTotalStakedFor,
  getTotalStaked,
  stakeAndVerify,
  add,
  sub,
  calculateAmountAfter,
  paddedBytes,
  buildBytesInput,
};
