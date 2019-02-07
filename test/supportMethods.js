const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

let StakingContract;
let TRST;

// read only, no need to deploy new set of contracts
before(async () => {
  StakingContract = await TimeLockedStaking.deployed();
  TRST = await TRSTArtifact.deployed();
});

contract('Support methods', () => {
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
