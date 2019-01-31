const TEST_RPC_PORT = process.env.TEST_RPC_PORT || '7545';

export default {
  CMS_URL: process.env.CMS_URL || 'https://tcr.wetrust.info/api/v0',
  WEB3_FALLBACK_PROVIDER: process.env.WEB3_FALLBACK_PROVIDER || `ws://localhost:${TEST_RPC_PORT}`,
  NETWORK_ID: process.env.NETWORK_ID || '5777', // 5777 is ganache's default
  TRST_ADDRESS: process.env.TRST_ADDRESS,
  TIME_LOCKED_STAKING_ADDRESS: process.env.TIME_LOCKED_STAKING_ADDRESS,
};
