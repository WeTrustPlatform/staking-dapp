import React from 'react';
import { DrizzleContext } from 'drizzle-react';

// add drizzle and drizzleState to the wrapped Component
export default (Component) => {
  // pass-through props
  const { props } = this;
  return (
    <DrizzleContext.Consumer>
      {(drizzleContext) => {
        const { drizzle, drizzleState } = drizzleContext;
        return (
          <Component {...props} drizzle={drizzle} drizzleState={drizzleState} />
        );
      }}
    </DrizzleContext.Consumer>);
};
