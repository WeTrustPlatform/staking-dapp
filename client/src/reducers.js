import { combineReducers } from 'redux';
import { drizzleReducers, generateContractsInitialState } from 'drizzle';
import TRST from './contracts/TRST.json';
import TimeLockedStaking from './contracts/TimeLockedStaking.json';
import {
  WEB3_NETWORK_ID,
  WEB3_AVAILABLE,
  WEB3_UNLOCK_ACCOUNT,
  WEB3_LOCK_ACCOUNT,
  WEB3_TRST_BALANCE,
  ACCOUNT_ACTIVITIES,
  OVERALL_STATS,
} from './actions';

const drizzleOptions = {
  contracts: [
    TRST,
    TimeLockedStaking,
  ],
};

const initialState = {
  networkId: 'unknown',
  account: null,
  hasWeb3: false,
  trstBalance: '0',
  accountActivities: [],
  overallStats: {
    currentStakes: '0',
    averageStakes: '0',
    averageStakeInUSD: '0',
    currentStakers: '0',
  },
  contracts: generateContractsInitialState(drizzleOptions),
};

function appReducers(state = initialState, action) {
  switch (action.type) {
    case WEB3_NETWORK_ID:
      return Object.assign({}, state, {
        networkId: String(action.networkId),
      });
    case WEB3_AVAILABLE:
      return Object.assign({}, state, {
        hasWeb3: true,
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
    case ACCOUNT_ACTIVITIES:
      return Object.assign({}, state, {
        accountActivities: action.accountActivities,
      });
    case OVERALL_STATS:
      return Object.assign({}, state, {
        overallStats: action.overallStats,
      });
    default:
      return state;
  }
}

const reducers = combineReducers({
  app: appReducers,
  ...drizzleReducers,
});

export default reducers;
