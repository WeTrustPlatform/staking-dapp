import {
  initRawContracts,
  initWeb3,
  initNetworkId,
  initContracts,
} from '../initHelpers';

it('should return contracts from json', () => {
  const contracts = initRawContracts();
  expect(contracts.TimeLockedStaking)
    .toHaveProperty('abi', expect.any(Array));
});

it('should init web3 with fallback provider', async () => {
  const web3 = initWeb3();
  const networkId = await initNetworkId(web3);
  // networkId is set up in the setUpTest and configs
  expect(networkId).toBe('5777');
});

it('should return invalid networkId', async () => {
  const web3 = initWeb3();
  const networkId = await initNetworkId(web3, '1');
  expect(networkId).toBe('invalid');
});

it('should init web3 contracts', async () => {
  const rawContracts = initRawContracts();
  const web3 = initWeb3();
  const contracts = await initContracts(web3, rawContracts);
  expect(contracts.TimeLockedStaking)
    .toHaveProperty(['methods', 'stake'], expect.anything());
});

it('should throw if contract cannot be loaded', () => {
  const web3 = initWeb3();
  expect(initContracts(web3, { EmptyContract: {} })).rejects.toThrow();
});
