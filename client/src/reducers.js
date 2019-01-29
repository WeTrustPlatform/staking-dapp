import {
  WEB3_NETWORK_ID,
  WEB3_AVAILABLE,
  WEB3_UNLOCK_ACCOUNT,
  WEB3_LOCK_ACCOUNT,
  WEB3_TRST_BALANCE,
  WEB3_ACCOUNT_ACTIVITIES,
  WEB3_OVERALL_STATS,
  WEB3_CONTRACTS,
} from './actions';

const initialState = {
  networkId: 'unknown',
  account: null,
  web3: null,
  trstBalance: '0',
  accountActivities: [],
  overallStats: {
    currentStakes: '0',
    averageStakes: '0',
    averageStakeInUSD: '0',
    currentStakers: '0',
  },
  contracts: {},
};

function reducers(state = initialState, action) {
  switch (action.type) {
    case WEB3_NETWORK_ID:
      return Object.assign({}, state, {
        networkId: String(action.networkId),
      });
    case WEB3_AVAILABLE:
      return Object.assign({}, state, {
        web3: action.web3,
      });
    case WEB3_UNLOCK_ACCOUNT:
      return Object.assign({}, state, {
        account: action.account,
      });
    case WEB3_LOCK_ACCOUNT:
      return Object.assign({}, state, {
        account: null,
      });
    case WEB3_TRST_BALANCE:
      return Object.assign({}, state, {
        trstBalance: action.trstBalance,
      });
    case WEB3_ACCOUNT_ACTIVITIES:
      return Object.assign({}, state, {
        accountActivities: action.accountActivities,
      });
    case WEB3_OVERALL_STATS:
      return Object.assign({}, state, {
        overallStats: action.overallStats,
      });
    case WEB3_CONTRACTS:
      return Object.assign({}, state, {
        contracts: action.contracts,
      });
    default:
      return state;
  }
}

export default reducers;
