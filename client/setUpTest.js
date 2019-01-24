const createServer = () => new Promise((resolve) => {
  const ganche = require('ganache-cli');
  const server = ganche.server({
    network_id: 1111,
    accounts: [
      {
        secretKey:
            '0x275ef35f55525049678090f9e32d16cbcca06f07dc4f51e297ed39a47d901981',
        balance: '0x4563918244f40000',
      },
      {
        secretKey:
            '0x08216419c2c2e9bfaf5f88885cbe89eabb1671cae4a09311c7ddcec77e1bfb77',
        balance: '0x4563918244f40000',
      },
    ],
  });

  const port = process.env.TEST_RPC_PORT || 7545;
  server.listen(port, (err) => {
    if (err) throw err;

    const ws = `ws://localhost:${port}`;

    console.log(`Testrpc is running ${ws}`);

    // expose SERVER for teardown
    global.__SERVER__ = server;

    resolve(ws);
  });

  server.on('close', () => console.log('Testrpc is closing...'));
});

let ws;
module.exports = async () => {
  if (!ws) {
    ws = await createServer();
  }
  return ws;
};
