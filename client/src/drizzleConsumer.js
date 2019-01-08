import React from 'react';
import { DrizzleContext } from 'drizzle-react';

// add drizzle and drizzleState to the wrapped Component
export default (Component) => {
  class DrizzleConsumer extends React.Component {
    render() {
      // pass-through props
      const { props } = this;
      return (
        <DrizzleContext.Consumer>
          {(drizzleContext) => {
            const { drizzle, drizzleState, initialized } = drizzleContext;
            return (
              <Component
                {...props}
                drizzle={drizzle}
                drizzleState={drizzleState}
                initialized={initialized}
              />
            );
          }}
        </DrizzleContext.Consumer>);
    }
  }

  return DrizzleConsumer;
};
