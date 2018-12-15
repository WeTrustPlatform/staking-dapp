export const WEB3_UNLOCK_ACCOUNT = 'WEB3_UNLOCK_ACCOUNT';
export const WEB3_LOCK_ACCOUNT = 'WEB3_LOCK_ACCOUNT';
export const WEB3_AVAILABLE = 'WEB3_AVAILABLE';
export const WEB3_NETWORK_ID = 'WEB3_NETWORK_ID';
export const WEB3_TRST_BALANCE = 'WEB3_TRST_BALANCE';
export const ACCOUNT_ACTIVITIES = 'ACCOUNT_ACTIVITIES';
export const OVERALL_STATS = 'OVERALL_STATS';

export function unlockAccount(account) {
  return { type: WEB3_UNLOCK_ACCOUNT, account };
}

export function lockAccount() {
  return { type: WEB3_LOCK_ACCOUNT };
}

export function findTrstBalance(trstBalance) {
  return { type: WEB3_TRST_BALANCE, trstBalance };
}

export function findNetworkId(networkId) {
  return { type: WEB3_NETWORK_ID, networkId };
}

export function findWeb3() {
  return { type: WEB3_AVAILABLE };
}

export function fetchAccountActivities(accountActivities) {
  return { type: ACCOUNT_ACTIVITIES, accountActivities };
}

export function fetchOverallStats(overallStats) {
  return { type: OVERALL_STATS, overallStats };
}
