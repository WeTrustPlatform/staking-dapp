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

export const bigNumber = (s) => web3.utils.toBN(s);

export const trstInBN = (s) => bigNumber(s).div(bigNumber(1e6));

export const trst = (s) => numberString(trstInBN(s));

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
