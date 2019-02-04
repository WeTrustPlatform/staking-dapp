export const status = {
  PENDING: 'PENDING',
  NOT_STARTED: 'NOT_STARTED',
  TRIGGERED: 'TRIGGERED',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};


// Wrapper arround this.setState for blockchain transactions
// Goal: To avoid calling this.setState for each tx
// Usage: this.state = { blockchainTx: init(this, 'name of this tx') }
//
const stateHelper = {
  tx: {
    approveTRST: 'approve TRST state',
    stakeTRST: 'stake TRST state',
  },
  init: (context, name) => {
    const getTxStatus = () => context.state[name].txStatus;
    const getTxHash = () => context.state[name].txHash;

    const getInitialState = () => ({
      txStatus: status.NOT_STARTED,
      txHash: null,
    });

    const setStatus = (txStatus) => {
      const currentState = context.state[name];
      context.setState({
        [name]: Object.assign({}, currentState, { txStatus }),
      });
    };

    const setNotStarted = () => {
      context.setState({
        [name]: getInitialState(),
      });
    };
    const setTriggered = (txHash) => {
      context.setState({
        [name]: {
          txStatus: status.TRIGGERED,
          txHash,
        },
      });
    };
    const setPending = () => {
      setStatus(status.PENDING);
    };
    const setFailure = (message) => {
      setStatus(status.FAILURE);
      context.setErrorMessage(message || `Error while executing ${name} transaction.`);
    };
    const setSuccess = () => {
      setStatus(status.SUCCESS);
    };

    return ({
      getTxStatus,
      getTxHash,
      getInitialState,
      setStatus,
      setNotStarted,
      setTriggered,
      setPending,
      setFailure,
      setSuccess,
    });
  },
};

export default stateHelper;
