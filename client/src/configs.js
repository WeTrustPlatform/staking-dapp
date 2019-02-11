const TEST_RPC_PORT = process.env.TEST_RPC_PORT || '7545';

export default {
  CMS_URL: process.env.REACT_APP_CMS_URL || 'https://staking-staging.wetrust.io/api/v0',
  WEB3_FALLBACK_PROVIDER: process.env.REACT_APP_WEB3_FALLBACK_PROVIDER || `ws://localhost:${TEST_RPC_PORT}`,
  NETWORK_ID: process.env.REACT_APP_NETWORK_ID || '5777', // 5777 is ganache's default
  NODE_ENV: process.env.NODE_ENV || 'development',
};
