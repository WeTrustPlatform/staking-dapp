const TRST = artifacts.require('lib/TRST');

const freeTRST = '1000000000000'; // 1M trst
module.exports = function (deployer, network, accounts) {
  if (network !== 'mainnet') {
    deployer.deploy(TRST, accounts[0]).then((instance) => {
      instance.transfer(accounts[1], freeTRST);
    });
  }
};
