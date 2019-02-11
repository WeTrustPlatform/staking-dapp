# staking-dapp
Stake TRST for Your Favorite NPO's

### Development environment
- Node LTS [v10.15.1](https://nodejs.org/dist/latest-v10.x/)
- [Yarn](https://yarnpkg.com/en/)
- [Ganache CLI](https://github.com/trufflesuite/ganache-cli)

### Smart contracts
- Install dependencies:
```
yarn
```

- Launch local blockchain testnet:
```
ganache-cli -p 7545 -i 5777 -m "goat junior borrow october horse sugar enlist bomb seek box carbon fat"
```
Note: The front-end is configed for rpc `port` 7545 and `networkId` 5777 and contracts are deployed using the accounts from the above seed phrases.

- Deploy contracts on local:
```
yarn deploy
```

### Web app
- The web application is in `client/`  So make sure you are inside the client folder.
```
cd client
```

- Install dependencies:
```
yarn
```

- Launch the web server:
```
yarn start
```
The app is served at http://localhost:3000. 

- Configure Metamask to use the local blockchain at http://localhost:7545.  If you restart the local blochain, make sure to reset the account's nonce in Metamask.

### License
[GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.txt) &copy; WeTrustPlatform
