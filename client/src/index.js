import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { DrizzleContext } from 'drizzle-react';
import { Drizzle, generateStore } from 'drizzle';
import reducers from './reducers';
import theme from './theme';
import MyDrizzleApp from './components/MyDrizzleApp';
import './index.css';
import drizzleOptions from './drizzleOptions';
import * as serviceWorker from './serviceWorker';

const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

const store = createStore(reducers);
function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <DrizzleContext.Provider drizzle={drizzle}>
            <MyDrizzleApp />
          </DrizzleContext.Provider>
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
