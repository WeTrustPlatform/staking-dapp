const web3 = require('web3');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

const {
  stakeAndVerify,
  verifyBalances,
  buildBytesInput,
} = require('./utils');


let staker;
let StakingContract;
let TRST;

const runSanityMatrix = (matrix) => {
  for (const payload of matrix) {
    it(`Test stake/unstake with payload ${payload}`, async () => {
      const amount = web3.utils.toWei('1', 'gwei'); // 1000 TRST

      const balances = await stakeAndVerify(staker, amount, payload, TRST, StakingContract);

      await StakingContract.unstake(amount, payload, { from: staker });

      // verify all the balances are the same as the very beginning
      await verifyBalances(balances.before, staker, TRST, StakingContract);
    });
  }
};

before(async () => {
  StakingContract = await TimeLockedStaking.deployed();
  TRST = await TRSTArtifact.deployed();
});

contract('should be able to stake and unstake and balance is transfered correctly', (accounts) => {
  [staker] = accounts;

  runSanityMatrix([
    '0x',
    '0x0',
    buildBytesInput('0'),
    buildBytesInput('1'),
    buildBytesInput('2'),
    buildBytesInput('2', '0'),
    buildBytesInput('2', '1'),
    buildBytesInput('2', '1', [64, 128]),
  ]);
});

contract('Staking Sanity', (accounts) => {
  [staker] = accounts;

  it('should accept an address in the constructor', async () => {
    const erc20 = await StakingContract.token();
    assert.strictEqual(erc20, TRST.address);
  });

  it('should return correct supportsInterface', async () => {
    const eip165 = await StakingContract.supportsInterface('0x01ffc9a7');
    assert.ok(eip165);
    const eip900 = await StakingContract.supportsInterface('0x8efdf8ee');
    assert.ok(eip900);
    const invalid = await StakingContract.supportsInterface('0xffffffff');
    assert.ok(!invalid);
  });

  it('should return supportsHistory false', async () => {
    const isSupportsHistory = await StakingContract.supportsHistory();
    assert.equal(isSupportsHistory, false);
  });
});
