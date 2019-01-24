module.exports = async () => {
  const server = global.__SERVER__;
  console.log(`Jest tear down testrpr: ${JSON.stringify(server.address())}`);
  server.close();
};
