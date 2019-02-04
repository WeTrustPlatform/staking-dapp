const Migrations = artifacts.require('./Migrations.sol');

module.exports = function (deployer, network) {
  if (network !== 'mainnet' && network !== 'rinkeby') {
    deployer.deploy(Migrations);
  }
};
