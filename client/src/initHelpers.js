import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import configs from './configs';

const initWeb3 = () => new Web3(Web3.givenProvider || configs.WEB3_FALLBACK_PROVIDER);

const initRawContracts = () => {
  const contractDir = path.resolve(__dirname, 'contracts');
  const contracts = {};
  fs.readdirSync(contractDir)
    .filter(
      file => file.indexOf('.') > 0 && file.endsWith('.json'),
    )
    .forEach((file) => {
      const filePath = path.join(contractDir, file);
      // use filename without extension .json as key
      const key = file.slice(0, -5);
      contracts[key] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });

  return contracts;
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
  initRawContracts,
  initAccount,
  initNetworkId,
};
