# staking-dapp

Stake TRST for Your Favorite NPO's

### Development environment

- Node LTS [v10.19.0](https://nodejs.org/dist/latest-v10.x/). Node v12 does not work because of the sha3 module used by keccakjs. Issue is tracked [here](https://github.com/axic/keccakjs/issues/10)
- [Yarn](https://yarnpkg.com/en/)
- [Ganache CLI](https://github.com/trufflesuite/ganache-cli)

### Install dependencies

- This will install all the dependencies of all the packages

```
yarn
```

- To add a new dependency in a package:

```
yarn --cwd packages/<package-name> add <dependency-name>
```

- To add a common devDependency:

```
yarn add -D <devDependency-name> -W
```

### Smart contracts

- Launch local blockchain testnet:

```
ganache-cli -p 7545 -i 5777 -m "goat junior borrow october horse sugar enlist bomb seek box carbon fat"
```

Note: The front-end is configed for rpc `port` 7545 and `networkId` 5777 and contracts are deployed using the accounts from the above seed phrases.

- Deploy contracts on local:

```
yarn --cwd packages/truffle deploy
```

### Web app

- Launch the web server:

```
yarn start
```

The app is served at http://localhost:3000.

- Configure Metamask to use the local blockchain at http://localhost:7545. If you restart the local blochain, make sure to reset the account's nonce in Metamask.

- (Optional) To interact with contracts on rinkeby:

```
REACT_APP_NETWORK_ID=4 yarn start
```

### Docker for local review

- Build the image:

```
docker build -t staking-dapp -f Dockerfile.mainnet .
```

- Run the container:

```
docker run -p 8000:80 --rm staking-dapp
```

- The app is served at `http://localhost:8000`

### Release new images

- Log in to docker on a deployment machine
- Make sure the account has push permission to `https://hub.docker.com/repository/docker/wetrustplatform/staking-dapp`
- Check the current release version
- Run `./docker.sh mainnet vA.B.C` where A.B.C is the next version
- Push github tags `git push --tags`
- On production server `docker pull wetrustplatform/staking-dapp:mainnet-latest && ./restart-mainnet.sh`

### License

[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.txt) &copy; WeTrustPlatform
