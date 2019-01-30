const SafeMath = artifacts.require('lib/SafeMath');
const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRST = artifacts.require('lib/TRST');

module.exports = function (deployer, network) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, TimeLockedStaking);
  const trstAddress = network !== 'mainnet' ? TRST.address : '0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B';
  deployer.deploy(TimeLockedStaking, trstAddress);
};
