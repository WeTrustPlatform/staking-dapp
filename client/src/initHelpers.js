import Web3 from 'web3';
import configs from './configs';
import {
  findWeb3,
  findNetworkId,
  lockAccount,
  unlockAccount,
  findContracts,
} from './actions';
import {
  dispatchAccountActivities,
  dispatchTRSTBalance,
  dispatchOverallStats,
} from './dispatch';
import TimeLockedStaking from './contracts/TimeLockedStaking.json';
import TRST from './contracts/TRST.json';

const initWeb3 = () => new Web3(Web3.givenProvider || configs.WEB3_FALLBACK_PROVIDER);

const initNetworkId = async (web3, expectedNetwork = configs.NETWORK_ID) => {
  const id = String(await web3.eth.net.getId());
  if (id !== expectedNetwork) {
    return 'invalid';
  }
  return id;
};

const initContracts = async (web3, rawContracts = { TimeLockedStaking, TRST }) => {
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

const initBlockchainState = async (dispatch) => {
  const web3 = initWeb3();
  dispatch(findWeb3(web3));

  if (window.ethereum && window.ethereum.enable) {
    window.ethereum.enable();
  }

  if (web3.givenProvider) {
    const networkId = await initNetworkId(web3);
    dispatch(findNetworkId(networkId));

    if (networkId !== 'invalid') {
      const web3Contracts = await initContracts(web3);

      if (web3Contracts) {
        dispatch(findContracts(web3Contracts));

        await dispatchOverallStats(dispatch, web3Contracts.TimeLockedStaking);

        const account = await initAccount(web3);
        if (account) {
          dispatch(unlockAccount(account));
          dispatchAccountActivities(dispatch, web3Contracts.TimeLockedStaking, account);
          dispatchTRSTBalance(dispatch, web3Contracts.TRST, account);
        } else {
          dispatch(lockAccount());
        }
      } else {
        console.log('cannot load contracts');
      }
    } else {
      console.log('wrong network id');
    }
  } else {
    console.log('no provider');
  }
};

export {
  initWeb3,
  initContracts,
  initAccount,
  initNetworkId,
  initBlockchainState,
};
