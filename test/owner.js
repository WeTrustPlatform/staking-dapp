const TimeLockedStaking = artifacts.require('TimeLockedStaking');
const TRSTArtifact = artifacts.require('lib/TRST');

contract('Only owner can change emergency status', (accounts) => {
  const [deployer, owner, nonOwner] = accounts;
  let contract;
  let TRST;
  beforeEach(async () => {
    // no staking in this test, so it doesn't affect TRST balances
    TRST = await TRSTArtifact.deployed();
    // deploy new contract to explicitly specify a contract owner
    contract = await TimeLockedStaking.new(TRST.address, owner, { from: deployer });
  });

  it('should throw if nonOwner calls setEmergency', async () => {
    const actualOwner = await contract.owner();
    assert.notEqual(actualOwner, nonOwner);
    assert.notEqual(actualOwner, deployer);
    assert.equal(actualOwner, owner);
    try {
      await contract.setEmergency(true, { from: nonOwner });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('msg.sender must be owner.'));
    }
  });

  it('should throw if deployer calls setEmergency', async () => {
    try {
      await contract.setEmergency(true, { from: deployer });
      assert.fail('Not supposed to reach here');
    } catch (e) {
      assert(e.toString().includes('msg.sender must be owner.'));
    }
  });

  it('should change the emergency', async () => {
    // turn on
    await contract.setEmergency(true, { from: owner });
    let emergency = await contract.emergency();
    assert(emergency);

    // turn off
    await contract.setEmergency(false, { from: owner });
    emergency = await contract.emergency();
    assert(!emergency);
  });
});
