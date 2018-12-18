import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { DrizzleProvider } from 'drizzle-react';
import { generateContractsInitialState } from 'drizzle';
import reducers from './reducers';
import theme from './theme';
import HomePage from './components/HomePage';
import './index.css';
import drizzleOptions from './drizzleOptions';
import * as serviceWorker from './serviceWorker';

const initialState = {
  app: {
    networkId: 'unknown',
    account: null,
    hasWeb3: false,
    trstBalance: '0',
    accountActivities: [],
    overallStats: {
      currentStakes: '0',
      averageStakes: '0',
      averageStakeInUSD: '0',
      currentStakers: '0',
    },
  },
  contracts: generateContractsInitialState(drizzleOptions),
};
const store = createStore(reducers, initialState);

function App() {
  return (
    <DrizzleProvider options={drizzleOptions} store={store}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </MuiThemeProvider>
    </DrizzleProvider>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
