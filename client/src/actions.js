export const WEB3_UNLOCK_ACCOUNT = 'WEB3_UNLOCK_ACCOUNT';
export const WEB3_LOCK_ACCOUNT = 'WEB3_LOCK_ACCOUNT';
export const WEB3_AVAILABLE = 'WEB3_AVAILABLE';
export const WEB3_NETWORK_ID = 'WEB3_NETWORK_ID';
export const WEB3_TRST_BALANCE = 'WEB3_TRST_BALANCE';
export const WEB3_ACCOUNT_ACTIVITIES = 'WEB3_ACCOUNT_ACTIVITIES';
export const WEB3_OVERALL_STATS = 'WEB3_OVERALL_STATS';
export const WEB3_CONTRACTS = 'WEB3_CONTRACTS';
export const WEB3_USERS_STATS = 'WEB3_USERS_STATS';
export const WEB3_CAUSES_STATS = 'WEB3_CAUSES_STATS';

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

export function findWeb3(web3) {
  return { type: WEB3_AVAILABLE, web3 };
}

export function findAccountActivities(accountActivities) {
  return { type: WEB3_ACCOUNT_ACTIVITIES, accountActivities };
}

export function findOverallStats(overallStats) {
  return { type: WEB3_OVERALL_STATS, overallStats };
}

export function findContracts(contracts) {
  return { type: WEB3_CONTRACTS, contracts };
}

export function findUsersStats(usersStats) {
  return { type: WEB3_USERS_STATS, usersStats };
}

export function findCausesStats(causesStats) {
  return { type: WEB3_CAUSES_STATS, causesStats };
}
