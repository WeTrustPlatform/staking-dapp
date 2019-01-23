import Web3 from 'web3';
import configs from './configs';

const initWeb3 = () => new Web3(Web3.givenProvider || configs.WEB3_FALLBACK_PROVIDER);

const initContracts = (web3) => {
  // TODO Populate contract objects
};

const initAccount = async (web3) => {
  const accounts = await web3.eth.getAccounts();
  // always use the first as current account
  return accounts[0];
};

const initNetworkId = async (web3) => {
  const id = await web3.eth.net.getId();
  if (configs.NETWORK_ID !== 'dev' && id !== configs.NETWORK_ID) {
    return 'invalid';
  }
  return id;
};

export {
  initWeb3,
  initContracts,
  initAccount,
  initNetworkId,
};
