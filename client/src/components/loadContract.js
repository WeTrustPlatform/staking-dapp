import contracts from 'Embark/contracts';
import assert from 'assert';
import { prefix0x } from './formatter';

const paddedBytes = (numberString) => {
  const { utils } = web3;
  const hex = utils.toHex(numberString);
  const padded = utils.padLeft(hex, 32);
  return utils.hexToBytes(padded);
};

/**
 * Build stake payload from timeSignal and voteSignal
 * @param timeSignal Locked in duration in seconds
 * @param voteSignal Any number in string. It is emitted in the event log
 * but not stored
 */
const buildBytesInput = (timeSignal, voteSignal) => {
  const paddedTimeSignal = paddedBytes(timeSignal, 32);
  const paddedVoteSignal = paddedBytes(voteSignal, 32);
  const data = paddedBytes('0').concat(paddedTimeSignal, paddedVoteSignal);
  const hex = web3.utils.bytesToHex(data);
  return hex;
};

// This method is for working around Embark's issue
// with stale contracts.
// Case 1: Load the app first and then log in
// Case 2: Change account in metamask
export default function loadContract(contractName) {
  const contract = contracts[contractName];
  assert(contract);
  return new web3.eth.Contract(
    contract.options.jsonInterface,
    contract.address,
    {
      from: web3.eth.defaultAccount,
    },
  );
}

export function getStakePayload(durationInDays, npo) {
  assert(npo.ein.length > 0, 'EIN not found.');
  // blockchain uses timestamp in seconds
  const durationInSeconds = durationInDays * 24 * 60 * 60;
  const lockedUntil = Math.floor(Date.now() / 1000) + durationInSeconds;
  const payload = buildBytesInput(lockedUntil, npo.ein);
  return payload;
}

// Given a stake payload
// @param payload 0x<32bytes length><32bytes until in seconds><32bytes ein>
// Normal payload string should have length of 2(0x) + 32(length) + 32(until) + 32(ein) = 98
// @return { lockedUntil: <Date>, ein: <NPO ein> }
export function parseStakePayload(payload) {
  const { toBN, padRight } = web3.utils;
  // padded to 0x<96 bytes>
  const paddedPayload = padRight(payload, 96);

  const ein = toBN(prefix0x(paddedPayload.substring(66, 98))).toString();

  // convert seconds to milliseconds
  const timestampInMilliseconds = toBN(prefix0x(paddedPayload.substring(34, 66)))
    .mul(toBN(1000))
    .toNumber();
  const lockedUntil = new Date(timestampInMilliseconds).toLocaleString();

  return {
    ein,
    lockedUntil,
  };
}
