import assert from 'assert';
import web3 from 'web3';
import axios from 'axios';
import { prefix0x, networkName } from './formatter';
import configs from './configs';

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

// TODO get other info as well, maybe cacheing
// Call CMS to get organization details like name and address
export const getNameFromCMS = async (stakingId) => {
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

  const npo = res && res.data;

  return (npo && npo.name) || 'Unknown';
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
