const TRST = artifacts.require('lib/TRST');

module.exports = function (deployer, network, accounts) {
  if (network !== 'mainnet') {
    deployer.deploy(TRST, accounts[0]);
  }
}
