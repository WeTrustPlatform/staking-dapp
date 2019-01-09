// ./contracts is symlink to the <root>/build/contracts/
import TRST from '../contracts/TRST.json';
import TimeLockedStaking from '../contracts/TimeLockedStaking.json';

const drizzleOptions = {
  contracts: [
    TRST,
    TimeLockedStaking,
  ],
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:7545',
    },
  },
};

export default drizzleOptions;
