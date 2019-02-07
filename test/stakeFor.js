const {
  unstakeAndVerifyBalances,
  getCurrentBalances,
  calculateBalances,
  verifyBalances,
  deposit,
  withdraw,
} = require('./utils');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

let StakingContract;
let TRST;

before(async () => {
  TRST = await TRSTArtifact.deployed();
  StakingContract = await TimeLockedStaking.deployed();
});

contract('Stake for other and the beneficiary can unstake', (accounts) => {
  // from the StakingContract perspective, both are stakers
  const [donor, beneficiary] = accounts;
  const amount = '1';
  const data = '0x';

  it('should stake and beneficiary should be able to unstake', async () => {
    await TRST.approve(StakingContract.address, amount, { from: donor });
    const donorBalancesBefore = await getCurrentBalances(donor, data, TRST, StakingContract);

    // TODO validate balances of the beneficiary before and after stakeFor, maybe?
    // this dirty workaround which makes sure the beneficiary
    // has 0 balance in the beginning is sufficient
    // because if stakeFor does not register the correct balance
    // then unstake will fail
    const beneficiaryBalancesBefore = await getCurrentBalances(donor, data, TRST, StakingContract);
    assert.equal(beneficiaryBalancesBefore.stakerStakeAmount.toString(), '0');

    await StakingContract.stakeFor(beneficiary, amount, data, { from: donor });

    const donorBalancesAfterStakeFor = calculateBalances(
      donorBalancesBefore, deposit, amount, true,
    );
    await verifyBalances(
      donorBalancesAfterStakeFor, donor, data, TRST, StakingContract,
    );

    // unstake doesn't care about the original staker
    // as if beneficiary was the donor
    await unstakeAndVerifyBalances(beneficiary, amount, data, TRST, StakingContract);

    const donorBalancesAfterUnstake = calculateBalances(
      donorBalancesAfterStakeFor, withdraw, amount, true,
    );
    await verifyBalances(
      donorBalancesAfterUnstake, donor, data, TRST, StakingContract,
    );
  });
});
