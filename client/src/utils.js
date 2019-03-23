import assert from 'assert';
import axios from 'axios';
import web3 from 'web3';
import pickBy from 'lodash.pickby';
import configs from './configs';
import { networkName, prefix0x, bigNumber } from './formatter';

const { toBN, padRight, toHex, padLeft, hexToBytes, bytesToHex } = web3.utils;

const paddedBytes = (numberString) => {
  const hex = toHex(numberString);
  const padded = padLeft(hex, 64);
  return hexToBytes(padded);
};

/**
 * Build stake payload from timeSignal and voteSignal
 * @param timeSignal Locked in duration in seconds
 * @param voteSignal Any number in string. It is emitted in the event log
 * but not stored
 */
const buildBytesInput = (timeSignal, voteSignal) => {
  const paddedTimeSignal = paddedBytes(timeSignal);
  const paddedVoteSignal = paddedBytes(voteSignal);
  const data = paddedTimeSignal.concat(paddedVoteSignal);
  const hex = bytesToHex(data);
  return hex;
};

export function getStakePayload(durationInDays, npo) {
  assert(npo.stakingId.length > 0, 'stakingId not found.');
  // blockchain uses timestamp in seconds
  // for manual testing on dev
  const durationInSeconds =
    configs.NODE_ENV === 'development'
      ? Number(durationInDays)
      : Number(durationInDays) * 24 * 60 * 60;
  const lockedUntil = Math.floor(Date.now() / 1000) + durationInSeconds;
  const payload = buildBytesInput(lockedUntil, npo.stakingId);
  return payload;
}

// Given a stake payload
// @param payload 0x<32bytes until in seconds><32bytes stakingId>
// Normal payload string should have length of 2(0x) + 64(until) + 64(stakingId) = 130
// @return { lockedUntil: <Date>, stakingId: <Project stakingId> }
export function parseStakePayload(payload) {
  // padded to 0x<128 bytes>
  const paddedPayload = padRight(payload, 128);

  const stakingId = toBN(prefix0x(paddedPayload.substring(66, 130))).toString();

  // convert seconds to milliseconds
  const timestampInMilliseconds = toBN(prefix0x(paddedPayload.substring(2, 66)))
    .mul(toBN(1000))
    .toNumber();

  // this unlockedAt is from the stake input payload
  // it is not necessary the same as the contract's unLockedAt
  // smart contract's unlockedAt maximum value is 365 days
  // from the stake's block.timestamp
  const unlockedAtInPayload = new Date(timestampInMilliseconds);

  return {
    stakingId,
    unlockedAtInPayload,
  };
}

export const validateNetworkId = (networkId) => {
  if (networkId === 'invalid') {
    return `Please switch to ${networkName(configs.NETWORK_ID)}`;
  }

  return null;
};

// TODO this is here for backward compatibility. Refactor needed
export const getNameFromCMS = async (stakingId) => {
  const cause = await getCauseFromCMS(stakingId);
  return (cause && cause.name) || 'Unknown';
};

// Call CMS to get organization details like name and address
export const getCauseFromCMS = async (stakingId) => {
  let res;
  try {
    // Users may pass in any stakingId when they stake via
    // other methods i.e. using MyEtherWallet
    // If stakingId is invalid or not found,
    // just show default name 'Unknown'
    assert(stakingId, 'Invalid stakingId.');
    // Some EIN starts with 0, make sure staking_id has at least 9 digits
    //
    const padded = padLeft(stakingId, 9);
    res = await axios.get(`${configs.CMS_URL}/charities?staking_id=${padded}`);
  } catch (e) {
    console.log(e);
  }

  const cause = res && res.data;

  return cause;
};

// Call staking contract to get the unlockedAt
export const getUnlockedAtFromBlockchain = async (
  user,
  stakeData,
  TimeLockedStaking,
) => {
  // get the real unlockedAt in seconds
  // set by the contract
  const realUnlockedAt = await TimeLockedStaking.methods
    .getStakeRecordUnlockedAt(user, stakeData)
    .call();
  const realUnlockedAtDate = new Date(realUnlockedAt * 1000);
  return realUnlockedAtDate;
};

// determine canUnstake after getting the correct unlockedAt
// @param unlockedAt Date object of the unlockedAt got from blockchain
// @param rawAmount BN object of the amount got from event log
export const determineCanUnstake = (unlockedAt, rawAmount) => {
  const isBeforeNow = Date.now() > unlockedAt.getTime();
  const hasBalance = rawAmount.gt(toBN(0));
  return isBeforeNow && hasBalance;
};

export const delay = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

/**
 * Trims the string removing the middle part
 * @param {string} str Any text, e.g. Ethereum Address
 * @param {number} front Number of characters to take from the front of the string
 * @param {number} end Number of characters to take from the end of the string
 */
export const trim = (str, front = 6, end = 4) => {
  const endString = str.substring(str.length - end);
  const startString = str.substring(0, front);
  return `${startString}...${endString}`;
};

/**
 * Transform CMS result to cause info
 * @param {Object} result from calling CMS
 * @return {Object} cause info
 */
export const mapCMSCause = (r) => ({
  name: r.name,
  stakingId: r.staking_id,
  isOnSpring: r.is_on_spring,
  is501c3: r.is_501c3,
  city: r.city,
  state: r.state,
  country: r.country,
});

/**
 * Determine the rank of causes that haven't had any stakes
 * @param { stakingId: rank} ranking map
 * @return default rank
 */
export const getDefaultRank = (ranks) => {
  const collection = Object.values(ranks);
  return collection.length + 1;
};

/**
 * Get the ranking map giving all causes' stats
 * @param { stakeId: { amount } } causesStats should be already filtered
 * @return { stakeId: rank }
 */
const getRanks = (filteredCausesStats) => {
  const ranks = {};
  const amounts = Object.values(filteredCausesStats).map((s) => s.amount);
  // a > b then a is sorted before b
  const sortedAmounts = amounts.sort((a, b) => (a.gt(b) ? -1 : 1));

  for (const stakingId of Object.keys(filteredCausesStats)) {
    const { amount } = filteredCausesStats[stakingId];
    ranks[stakingId] = sortedAmounts.findIndex((e) => e.eq(amount)) + 1;
  }
  return ranks;
};

/**
 * Get the ranking map of Spring causes
 * @param { stakeId: { amount, isOnSpring } } causesStats from store
 * @return { stakeId: rank }
 */
export const getSpringRanks = (causesStats) => {
  const filtered = pickBy(causesStats, (v) => !!v.isOnSpring);
  return getRanks(filtered);
};

/**
 * Get the ranking map of non-Spring causes
 * @param { stakeId: { amount, isOnSpring } } causesStats from store
 * @return { stakeId: rank }
 */
export const getNonSpringRanks = (causesStats) => {
  const filtered = pickBy(causesStats, (v) => !v.isOnSpring);
  return getRanks(filtered);
};

/**
 * Get rank of given cause based on the whole causesStats
 * @param { isOnSpring, stakeId }
 * @param { stakeId: { amount } } causesStats from store
 * @return rank
 */
export const getCauseRank = (cause, causesStats) => {
  if (!cause || !cause.stakingId) {
    // fail silently
    return 999999;
  }

  const ranks = cause.isOnSpring
    ? getSpringRanks(causesStats)
    : getNonSpringRanks(causesStats);

  return ranks[cause.stakingId] || getDefaultRank(ranks);
};

/**
 * Get new rank based on the delta amount added
 * @param { isOnSpring, stakingId }
 * @param { stakeId: { amount } }
 * @param delta BigNumber could be positive or negative
 * @return new rank
 */
export const getNewRank = (cause, causesStats, delta) => {
  if (!cause || !cause.stakingId) {
    // fail silently
    return 999999;
  }
  const stats = causesStats[cause.stakingId] || {};
  const currentStakedAmount = stats.amount || bigNumber(0);
  const newStakedAmount = currentStakedAmount.add(delta);

  const newCausesStats = Object.assign({}, causesStats, {
    [cause.stakingId]: {
      amount: newStakedAmount,
      isOnSpring: !!cause.isOnSpring,
    },
  });
  const newRank = getCauseRank(cause, newCausesStats);
  return newRank;
};
