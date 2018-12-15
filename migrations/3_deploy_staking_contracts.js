const SafeMath = artifacts.require('lib/SafeMath');
const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRST = artifacts.require('lib/TRST');

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, TimeLockedStaking);
  deployer.deploy(TimeLockedStaking, TRST.address);
}
