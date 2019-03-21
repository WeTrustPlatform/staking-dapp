import Web3 from 'web3';
import configs from './configs';
import {
  findWeb3,
  findNetworkId,
  lockAccount,
  unlockAccount,
  findContracts,
} from './actions';
import { dispatchTRSTBalance } from './dispatch';
import dispatchStats from './dispatchStats';
import TimeLockedStaking from './contracts/TimeLockedStaking.json';
import TRST from './contracts/TRST.json';

const initWeb3 = () =>
  new Web3(Web3.givenProvider || configs.WEB3_FALLBACK_PROVIDER);

const initNetworkId = async (web3, expectedNetwork = configs.NETWORK_ID) => {
  const id = String(await web3.eth.net.getId());
  if (id !== expectedNetwork) {
    return 'invalid';
  }
  return id;
};

const initContracts = async (
  web3,
  rawContracts = { TimeLockedStaking, TRST },
) => {
  // assume the networkId is valid
  const networkId = await initNetworkId(web3);
  const web3Contracts = {};
  let hasError = false;
  for (const contractName of Object.keys(rawContracts)) {
    const rawContract = rawContracts[contractName];
    const deployInfo = rawContract.networks && rawContract.networks[networkId];
    if (deployInfo && deployInfo.address) {
      web3Contracts[contractName] = new web3.eth.Contract(
        rawContract.abi,
        deployInfo.address,
      );
      // Store deployedAt to make the filter events faster
      web3Contracts[contractName].deployedAt = deployInfo.deployedAt
        ? deployInfo.deployedAt
        : 0;
    } else {
      hasError = true;
    }
  }

  return hasError ? null : web3Contracts;
};

const initAccount = async (web3) => {
  const accounts = await web3.eth.getAccounts();
  // always use the first as current account
  return accounts[0];
};

const onNewAccount = (dispatch, account, contracts) => {
  dispatch(unlockAccount(account));
  dispatchStats(dispatch, contracts.TimeLockedStaking);
  dispatchTRSTBalance(dispatch, contracts.TRST, account);
};

const onNewNetworkId = async (dispatch, web3, networkId) => {
  if (networkId !== 'invalid') {
    const web3Contracts = await initContracts(web3);

    if (web3Contracts) {
      dispatch(findContracts(web3Contracts));

      await dispatchStats(dispatch, web3Contracts.TimeLockedStaking);

      const account = await initAccount(web3);
      if (account) {
        onNewAccount(dispatch, account, web3Contracts);
      } else {
        dispatch(lockAccount());
      }
    } else {
      console.log('cannot load contracts');
    }
  } else {
    console.log('wrong network id');
  }
};

const initWeb3OnUpdateListener = async (store) => {
  const { dispatch } = store;
  const { web3, account, networkId, contracts } = store.getState();

  const { publicConfigStore } = web3.currentProvider;

  if (publicConfigStore) {
    publicConfigStore.on('update', async (updates) => {
      const { selectedAddress, networkVersion } = updates;
      if (!selectedAddress) {
        dispatch(lockAccount());
        return;
      }

      if (
        String(account).toLowerCase() !== String(selectedAddress).toLowerCase()
      ) {
        onNewAccount(dispatch, selectedAddress, contracts);
      }

      // bug: networkVersion is 1 for ganache
      // this always triggers when account changes in the dev env
      // which is fine
      //
      if (networkId !== networkVersion) {
        await onNewNetworkId(dispatch, web3, networkVersion);
      }
    });
  }
};

const initBlockchainState = async (store) => {
  const { dispatch } = store;
  const web3 = initWeb3();
  dispatch(findWeb3(web3));

  const networkId = await initNetworkId(web3);
  dispatch(findNetworkId(networkId));
  await onNewNetworkId(dispatch, web3, networkId);

  await initWeb3OnUpdateListener(store);
};

export {
  initWeb3,
  initContracts,
  initAccount,
  initNetworkId,
  initBlockchainState,
  initWeb3OnUpdateListener,
};
