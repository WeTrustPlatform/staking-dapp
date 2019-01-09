import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import { Drizzle, generateStore } from 'drizzle';
import drizzleOptions from './drizzleOptions';
import WrappedHomepage from './WrappedHomePage';

const drizzleStore = generateStore(drizzleOptions);
const drizzleProvider = new Drizzle(drizzleOptions, drizzleStore);

class MyDrizzleApp extends React.Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzleProvider}>
        <WrappedHomepage />
      </DrizzleContext.Provider>
    );
  }
}

export default MyDrizzleApp;
