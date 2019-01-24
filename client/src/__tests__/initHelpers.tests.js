import { initRawContracts } from '../initHelpers';

it('should return contracts from json', () => {
  const contracts = initRawContracts();
  expect(contracts.TimeLockedStaking)
    .toHaveProperty('abi', expect.any(Array));
});
