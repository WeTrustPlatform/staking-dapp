import assert from 'assert';
import web3 from 'web3';
import { prefix0x, networkName } from './formatter';
import configs from './configs';

const paddedBytes = (numberString) => {
  const { utils } = web3;
  const hex = utils.toHex(numberString);
  const padded = utils.padLeft(hex, 64);
  return utils.hexToBytes(padded);
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
  const hex = web3.utils.bytesToHex(data);
  return hex;
};

export function getStakePayload(durationInDays, npo) {
  assert(npo.ein.length > 0, 'EIN not found.');
  // blockchain uses timestamp in seconds
  // for manual testing on dev
  const durationInSeconds = configs.NODE_ENV === 'development'
    ? Number(durationInDays) : Number(durationInDays) * 24 * 60 * 60;
  const lockedUntil = Math.floor(Date.now() / 1000) + durationInSeconds;
  const payload = buildBytesInput(lockedUntil, npo.ein);
  return payload;
}

// Given a stake payload
// @param payload 0x<32bytes until in seconds><32bytes ein>
// Normal payload string should have length of 2(0x) + 64(until) + 64(ein) = 130
// @return { lockedUntil: <Date>, ein: <NPO ein> }
export function parseStakePayload(payload) {
  const { toBN, padRight } = web3.utils;
  // padded to 0x<128 bytes>
  const paddedPayload = padRight(payload, 128);

  const ein = toBN(prefix0x(paddedPayload.substring(66, 130))).toString();

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
    ein,
    unlockedAtInPayload,
  };
}

export const validateNetworkId = (networkId) => {
  if (networkId === 'invalid') {
    return `Please switch to ${networkName(configs.NETWORK_ID)}`;
  }

  return null;
};
