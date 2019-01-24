import {
  initRawContracts,
  initWeb3,
  initNetworkId,
} from '../initHelpers';

it('should return contracts from json', () => {
  const contracts = initRawContracts();
  expect(contracts.TimeLockedStaking)
    .toHaveProperty('abi', expect.any(Array));
});

it('should init web3 with fallback provider', async () => {
  const web3 = initWeb3();
  const networkId = await initNetworkId(web3, 'dev');
  // networkId is set up in the setUpTest
  expect(networkId).toBe('1111');
});

it('should return invalid networkId', async () => {
  const web3 = initWeb3();
  const networkId = await initNetworkId(web3, '1');
  expect(networkId).toBe('invalid');
});
