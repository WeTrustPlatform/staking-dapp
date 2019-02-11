import web3 from 'web3';
import configs from './configs';

export const txLink = (txHash) => {
  const subDomain = configs.NETWORK_ID === '1' ? '' : 'rinkeby.';
  return `https://${subDomain}etherscan.io/tx/${txHash}`;
};

export const prefix0x = s => (String(s).startsWith('0x') ? s : `0x${s}`);

export const numberString = s => Number(s).toLocaleString();

export const currency = s => `$${Number(s).toFixed(2).toLocaleString()}`;

export const bigNumber = s => web3.utils.toBN(s);

export const trstInBN = s => bigNumber(s).div(bigNumber(1e6));

export const trst = s => numberString(trstInBN(s));

export const networkName = (networkId) => {
  const nameMapping = {
    1: 'Mainnet',
    4: 'Rinkeby',
  };
  return nameMapping[networkId] || `Privatenet-${networkId}`;
};
