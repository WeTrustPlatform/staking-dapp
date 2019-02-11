const SafeMath = artifacts.require('lib/SafeMath');
const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRST = artifacts.require('lib/TRST');

module.exports = function (deployer, network, accounts) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, TimeLockedStaking);

  let trstAddress;
  // accounts[0] is both deployer and owner on testnet
  let owner = accounts[0];
  if (network === 'mainnet') {
    trstAddress = '0xCb94be6f13A1182E4A4B6140cb7bf2025d28e41B';
    // hoang's ledger address
    owner = '0x0Ed8C3d25849fe3fe918A8863A04E71036cbc501';
  } else if (network === 'rinkeby') {
    trstAddress = '0x21036C54e16521B8809553956123E44054120226';
  } else {
    trstAddress = TRST.address;
  }

  deployer.deploy(TimeLockedStaking, trstAddress, owner);
};
