const SafeMath = artifacts.require('lib/SafeMath');
const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRST = artifacts.require('lib/TRST');

module.exports = function (deployer, network) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, TimeLockedStaking);

  let trstAddress = TRST.address;
  if (network === 'mainnet') {
    trstAddress = '0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B';
  } else if (network === 'rinkeby') {
    trstAddress = '0x21036C54e16521B8809553956123E44054120226';
  }

  deployer.deploy(TimeLockedStaking, trstAddress);
};
