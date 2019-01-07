import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import HomePage from './HomePage';

class MyDrizzleApp extends React.Component {
  render() {
    return (
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return 'Loading...';
          }

          return (
            <HomePage drizzle={drizzle} drizzleState={drizzleState} />
          );
        }}
      </DrizzleContext.Consumer>
    );
  }
}

export default MyDrizzleApp;
