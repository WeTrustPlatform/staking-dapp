import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import configs from './configs';

const CONTRACTS = ['TimeLockedStaking.json', 'TRST.json'];
const initWeb3 = () => new Web3(Web3.givenProvider || configs.WEB3_FALLBACK_PROVIDER);

const initRawContracts = () => {
  const contractDir = path.resolve(__dirname, 'contracts');
  const contracts = {};
  fs.readdirSync(contractDir)
    .filter(
      file => CONTRACTS.indexOf(file) > -1,
    )
    .forEach((file) => {
      const filePath = path.join(contractDir, file);
      // use filename without extension .json as key
      const key = file.slice(0, -5);
      contracts[key] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    });

  return contracts;
};

const initContracts = async (web3, rawContracts) => {
  const networkId = String(await web3.eth.net.getId());
  const web3Contracts = {};
  for (const contractName of Object.keys(rawContracts)) {
    const rawContract = rawContracts[contractName];
    const { address } = rawContract.networks[networkId];
    assert(address, `Contract ${rawContract.contractName} has not been deployed to network ${address}`);
    web3Contracts[contractName] = new web3.eth.Contract(rawContract.abi, address);
  }
  return web3Contracts;
};

const initAccount = async (web3) => {
  const accounts = await web3.eth.getAccounts();
  // always use the first as current account
  return accounts[0];
};

const initNetworkId = async (web3, expectedNetwork = configs.NETWORK_ID) => {
  const id = String(await web3.eth.net.getId());
  if (id !== expectedNetwork) {
    return 'invalid';
  }
  return id;
};

export {
  initWeb3,
  initRawContracts,
  initContracts,
  initAccount,
  initNetworkId,
};
