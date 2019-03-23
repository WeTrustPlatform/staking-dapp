export const WEB3_UNLOCK_ACCOUNT = 'WEB3_UNLOCK_ACCOUNT';
export const WEB3_LOCK_ACCOUNT = 'WEB3_LOCK_ACCOUNT';
export const WEB3_AVAILABLE = 'WEB3_AVAILABLE';
export const WEB3_NETWORK_ID = 'WEB3_NETWORK_ID';
export const WEB3_TRST_BALANCE = 'WEB3_TRST_BALANCE';
export const WEB3_CONTRACTS = 'WEB3_CONTRACTS';
export const WEB3_USERS_STATS = 'WEB3_USERS_STATS';
export const WEB3_CAUSES_STATS = 'WEB3_CAUSES_STATS';
export const UNSTAKE_EXIT = 'UNSTAKE_EXIT';
export const UNSTAKE_WARNING = 'UNSTAKE_WARNING';
export const UNSTAKE_PENDING = 'UNSTAKE_PENDING';
export const UNSTAKE_PENDING_BACKGROUND = 'UNSTAKE_PENDING_BACKGROUND';
export const UNSTAKE_SUCCESS = 'UNSTAKE_SUCCESS';
export const UNSTAKE_FAILURE = 'UNSTAKE_FAILURE';

export function unlockAccount(account) {
  return { type: WEB3_UNLOCK_ACCOUNT, account };
}

export function lockAccount() {
  return { type: WEB3_LOCK_ACCOUNT };
}

export function findTRSTBalance(trstBalance) {
  return { type: WEB3_TRST_BALANCE, trstBalance };
}

export function findNetworkId(networkId) {
  return { type: WEB3_NETWORK_ID, networkId };
}

export function findWeb3(web3) {
  return { type: WEB3_AVAILABLE, web3 };
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

export function unstake(step, activity) {
  return { type: step, activity };
}

export function unstakeExit() {
  return { type: UNSTAKE_EXIT };
}
