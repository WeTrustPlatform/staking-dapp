import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import theme from './theme';
import './index.css';
import HomePage from './components/HomePage';
import {
  initBlockchainState,
} from './initHelpers';

if (window.ethereum && window.ethereum.enable) {
  window.ethereum.enable();
}

const store = createStore(reducers);
initBlockchainState(store);

function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  );
}
ReactDOM.render(<App />, document.getElementById('root'));
