export const status = {
  PENDING: 'PENDING',
  NOT_STARTED: 'NOT_STARTED',
  TRIGGERED: 'TRIGGERED',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

const stateHelper = {
  tx: {
    approveTRST: 'approve TRST',
    stakeTRST: 'stake TRST',
  },
  initialState: () => ({
    txStatus: status.NOT_STARTED,
    txHash: null,
  }),
  setTriggered: (context, name, txHash) => {
    context.setState({
      [name]: {
        txStatus: status.TRIGGERED,
        txHash,
      },
    });
  },
  setFailure: (context, name, message) => {
    stateHelper.setStatus(context, name, status.FAILURE);
    context.setErrorMessage(message || `Error while executing ${name} transaction.`);
  },
  setSuccess: (context, name) => {
    stateHelper.setStatus(context, name, status.SUCCESS);
  },
  setPending: (context, name) => {
    stateHelper.setStatus(context, name, status.PENDING);
  },
  setNotStarted: (context, name) => {
    context.setState({
      [name]: stateHelper.initialState(),
    });
  },
  setStatus: (context, name, txStatus) => {
    const currentState = context.state[name];
    context.setState({
      [name]: Object.assign({}, currentState, { txStatus }),
    });
  },
};

export default stateHelper;
