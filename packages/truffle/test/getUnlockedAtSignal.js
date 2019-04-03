const web3 = require('web3');

const {
  paddedBytes,
  buildBytesInput,
  now,
} = require('./utils');

const TimeLockedStaking = artifacts.require('TimeLockedStaking');

// read only
let StakingContract;
before(async () => {
  StakingContract = await TimeLockedStaking.deployed();
});

// block.timestamp can vary
// the whole suite might take up to 5 minutes
// the unlocked time calculated by blockchain
// should be under 5 minutes difference
const TOLERANCE_IN_SECS = 60 * 5;

// Matrix:
// [
// [testName1, timeSignal1, voteSignal1, expectedOutput1, isExact],
// [testName2, timeSignal2, voteSignal2, expectedOutput2, isExact],
// ]
const runGetUnlockedAtSignalMatrix = (matrix) => {
  for (const testCase of matrix) {
    it(testCase[0], async () => {
      const input = buildBytesInput(testCase[1], testCase[2], [64, 64]);
      const timeLocked = await StakingContract.getUnlockedAtSignal(input);
      if (testCase[4]) {
        assert.equal(timeLocked.toNumber(), testCase[3]);
      } else {
        assert.ok(
          Math.abs(timeLocked.toNumber() - testCase[3] < TOLERANCE_IN_SECS,
            `Expected ${testCase[3]} vs. Actual ${timeLocked}`),
        );
      }
    });
  }
};

// all in seconds
const oneDay = 24 * 60 * 60;
const tomorrow = now + oneDay;

// These are not exact because it relies on block.timestamp + 365 days
const oneYearFromNow = now + 365 * oneDay;
const moreThanAYearFromNow = oneYearFromNow + oneDay;

contract('Test getUnlockedAtSignal matrix of happy cases', () => {
  runGetUnlockedAtSignalMatrix([
    ['payload has all 0s', '0', '0', 1, true],
    ['payload has only vote signal', '0', '1', 1, true],
    ['payload has only time signal = 0', '0', null, 1, true],
    ['payload has only time signal != 0', '2', null, 2, true],
    ['payload has both time and vote signals', '3', '2', 3, true],
    ['payload has time signal now', String(now), '0', now, true],
    ['payload has time signal tomorrow', String(tomorrow), '0', tomorrow, true],
    ['payload has time signal one year from now', String(oneYearFromNow), '0', oneYearFromNow, false],
    ['payload has time signal now without vote', String(now), null, now, true],
    ['payload has time signal tomorrow without vote', String(tomorrow), null, tomorrow, true],
    ['payload has time signal one year from now without vote', String(oneYearFromNow), null, oneYearFromNow, false],
  ]);
});

contract('Test getUnlockedAtSignal edge cases', () => {
  it('should return 1 when input is empty', async () => {
    const timeLocked = await StakingContract.getUnlockedAtSignal('0x');
    assert.equal(timeLocked, 1);
  });

  it('should return 1 when data.length < 32', async () => {
    const dataBytes = paddedBytes('2', 62); // padSize(62) == data.length(31)
    const input = web3.utils.bytesToHex(dataBytes);
    const timeLocked = await StakingContract.getUnlockedAtSignal(input);
    assert.equal(timeLocked, 1);
  });

  it('should work when vote signal is over left padded', async () => {
    const input = buildBytesInput('2', '1', [64, 128]);
    const timeLocked = await StakingContract.getUnlockedAtSignal(input);
    assert.equal(timeLocked, 2);
  });

  it('should work when vote signal is a huge number > uint256', async () => {
    const input = buildBytesInput('2', web3.utils.padRight('1', 128), [64, 128]);
    const timeLocked = await StakingContract.getUnlockedAtSignal(input);
    assert.equal(timeLocked, 2);
  });

  it('should return 1 year max', async () => {
    const input = buildBytesInput(moreThanAYearFromNow, '0');
    const timeLocked = await StakingContract.getUnlockedAtSignal(input);
    assert.ok(
      Math.abs(timeLocked - oneYearFromNow) < TOLERANCE_IN_SECS,
      `Expected ${oneYearFromNow} vs. Actual ${timeLocked}`,
    );
  });
});
