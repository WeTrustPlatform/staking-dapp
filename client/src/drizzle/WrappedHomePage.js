import React from 'react';
import { connect } from 'react-redux';
import {
  dispatchTRSTBalance,
} from '../dispatch';
import {
  lockAccount,
  unlockAccount,
  findWeb3,
} from '../actions';
import HomePage from '../components/HomePage';
import drizzleConsumer from './drizzleConsumer';

// Follow the Separate of Concern pattern.
// The idea is we don't want to tightly couple with Drizzle and its store.
//
// We want the app (i.e. HomePage) uses its own store
// and dispatch logic to interact with blockchain.
//
// The role of Drizzle is to provide the Web3 abstraction objects (web3js and contracts) to the app.
//
// Why don't we just use Drizzle store?
// 1. Drizzle does not have all the state we need as it's immature.
// For example, it cannot detect whether Metamask is installed but logged out.
// It does not trigger changes when users log out
//
// 2. Our app requires its own store no matter what framework we use.
// For example, having the staking activities in the global store is nice
// because we can share across pages and components.
// These are application specific states.
//
//
// Drizzle is temporary. We have to find a better tool to abstract Web3 and Contract objects.
// For any new tools, we just need to replace the /drizzle folder with new adapter.
class WrappedHomePage extends React.Component {
  componentDidUpdate(prevProps) {
    const { props } = this;
    const { drizzle, drizzleState, initialized } = props;

    // check if web3 object has changed
    if (prevProps.initialized !== initialized) {
      if (initialized) {
        const { TRST } = drizzle.contracts;
        const account = drizzleState.accounts[0];
        props.dispatch(unlockAccount(account));
        props.dispatch(findWeb3());
        dispatchTRSTBalance(props.dispatch, TRST, account);
      } else {
        props.dispatch(lockAccount());
      }
    }
  }

  render() {
    return (<HomePage />);
  }
}

export default connect()(drizzleConsumer(WrappedHomePage));
