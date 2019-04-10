import web3 from 'web3';
import configs from './configs';

export const txLink = (txHash) => {
  const subDomain = configs.NETWORK_ID === '1' ? '' : 'rinkeby.';
  return `https://${subDomain}etherscan.io/tx/${txHash}`;
};

export const prefix0x = (s) => (String(s).startsWith('0x') ? s : `0x${s}`);

export const numberString = (s) => Number(s).toLocaleString();

export const currency = (s) =>
  `$${Number(s)
    .toFixed(2)
    .toLocaleString()}`;

// does not support decimal
// used for converting all the values from blockchain
export const bigNumber = (s) => web3.utils.toBN(s);

// convert user input amount in string/bn/number to smallest TRST in bn
// input 1 TRST -> output 1e6 in bigNumber
// will throw if cannot convert
// will throw if decimal > 6
export const convertAmountToSmallestTRST = (s) =>
  bigNumber(web3.utils.toWei(s.toString(), 'mwei'));

// convert blockchain amount in string/bn/number to wholeTRST in String
// for view purpose only
// because all calcuations must be done in SmallestTRST bigNumber
// input 1e6 -> output 1 TRST
export const convertToWholeTRSTForView = (s) =>
  numberString(web3.utils.fromWei(s.toString(), 'mwei'));

export const networkName = (networkId) => {
  const nameMapping = {
    1: 'Mainnet',
    4: 'Rinkeby',
  };
  return nameMapping[networkId] || `Privatenet-${networkId}`;
};

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
