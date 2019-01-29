import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import theme from './theme';
import './index.css';
import * as serviceWorker from './serviceWorker';
import HomePage from './components/HomePage';
import {
  initBlockchainState,
} from './initHelpers';

const store = createStore(reducers);
initBlockchainState(store.dispatch);

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
