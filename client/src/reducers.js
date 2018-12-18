import { combineReducers } from 'redux';
import { drizzleReducers } from 'drizzle';
import {
  WEB3_NETWORK_ID,
  WEB3_AVAILABLE,
  WEB3_UNLOCK_ACCOUNT,
  WEB3_LOCK_ACCOUNT,
  WEB3_TRST_BALANCE,
  ACCOUNT_ACTIVITIES,
  OVERALL_STATS,
} from './actions';


function appReducers(state = {}, action) {
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
