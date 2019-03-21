import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import SearchInput from './SearchInput';
import CauseStakeInfo from './CauseStakeInfo';
import { getStakePayload, validateNetworkId, delay } from '../utils';
import stateHelper, { status } from './stateHelper';
import dispatchStats from '../dispatchStats';
import checkMark from '../images/check-mark.svg';
import errorMark from '../images/error-mark.svg';

const styles = (theme) => ({
  root: {
    margin: `${theme.mixins.toolbar.minHeight}px auto`,
    maxWidth: theme.breakpoints.values.md,
  },
  stake: {
    marginTop: theme.mixins.toolbar.minHeight / 2,
    marginBottom: theme.mixins.toolbar.minHeight / 2,
  },
  step: {
    display: 'flex',
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  stepIcon: {
    display: 'flex',
    alignSelf: 'center',
    paddingRight: 12,
  },
  button: {
    marginTop: 24,
  },
});

class StakeNow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      npo: {},
      durationInDays: 30,
      amount: 100,
      errorMessage: null,
      successMessage: null,
      isStaking: false,
      approveTRST: stateHelper.init(this, stateHelper.tx.approveTRST),
      stakeTRST: stateHelper.init(this, stateHelper.tx.stakeTRST),
    };

    this.onSelectedNpo = this.onSelectedNpo.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.handleStakeNow = this.handleStakeNow.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.renderStakingSteps = this.renderStakingSteps.bind(this);
  }

  onSelectedNpo(data) {
    this.setState({
      npo: data,
    });
  }

  onChangeAmount(event) {
    this.setState({
      amount: event.target.value,
    });
  }

  onChangeDuration(event) {
    this.setState({
      durationInDays: Number(event.target.value),
    });
  }

  setErrorMessage(err) {
    window.clearTimeout(this.timeOut);
    this.setState({
      errorMessage: err,
    });
    this.timeOut = window.setTimeout(
      () =>
        this.setState({
          errorMessage: null,
        }),
      5000,
    );
  }

  startStaking() {
    this.setState({
      isStaking: true,
      successMessage: null,
    });
    const { approveTRST, stakeTRST } = this.state;
    approveTRST.setPending();
    stakeTRST.setNotStarted();
  }

  handleStakeNow(e) {
    e.preventDefault();

    const inputError = this.validateInput(this.props, this.state);
    if (inputError) {
      this.setErrorMessage(inputError);
      return;
    }

    this.startStaking();

    const { amount, npo, durationInDays, approveTRST, stakeTRST } = this.state;

    const { web3, refreshStats, account, TRST, TimeLockedStaking } = this.props;

    const { toBN, toWei } = web3.utils;
    const stakeAmount = toWei(amount.toString(), 'mwei');

    // TODO HN get gasPrice from third party
    // This 'approve' tx needs to be fast so that
    // metammask does not display error message for
    // the next staking tx
    const gasPrice = toWei('40', 'gwei');

    const stakingAddress = TimeLockedStaking.options.address;
    TRST.methods
      .allowance(account, stakingAddress)
      .call()
      .then(
        (spendableAmount) =>
          new Promise((resolve, reject) => {
            if (toBN(spendableAmount).lt(toBN(stakeAmount))) {
              TRST.methods
                .approve(TimeLockedStaking.options.address, stakeAmount)
                .send({ from: account, gasPrice, gas: 100000 })
                .once('transactionHash', (h) => {
                  approveTRST.setTriggered(h);
                  // if approveTRST tx has not gone through
                  // metamask will display error
                  // even though the error message
                  // can be ignored
                  delay(3000).then(resolve);
                })
                .on('receipt', () => {
                  approveTRST.setSuccess();
                })
                .on('error', (err) => {
                  approveTRST.setFailure(err.message);
                  reject();
                });
            } else {
              approveTRST.setSuccess();
              resolve();
            }
          }),
      )
      .then(() => {
        stakeTRST.setPending();
        const stakePayload = getStakePayload(durationInDays, npo);
        return TimeLockedStaking.methods
          .stake(stakeAmount, stakePayload)
          .send({ from: account, gasPrice, gas: 200000 })
          .once('transactionHash', (stakeTxHash) => {
            stakeTRST.setTriggered(stakeTxHash);
          })
          .on('error', (err) => {
            stakeTRST.setFailure(err.message);
          });
      })
      .then(() => {
        stakeTRST.setSuccess();
        this.setState({
          successMessage:
            'Staking succeeded. Please check Your Stakes to view transaction hash.',
        });
        // Delay X seconds (arbitrary number) so that state is updated
        // infura is slow!!!
        // Otherwise, the realUnlockedAt is 0
        return delay(1000);
      })
      .then(() => {
        refreshStats(TimeLockedStaking);
      })
      .catch((err) => {
        this.setErrorMessage(err.message);
      });
  }

  validateInput(props, state) {
    const { web3, account, trstBalance, networkId } = props;

    const hasProvider = web3 && web3.givenProvider;
    if (!hasProvider) {
      return 'Cannot find Web3. Please install metamask.';
    }

    if (!account) {
      return 'Please unlock your account.';
    }

    const networkError = validateNetworkId(networkId);
    if (networkError) {
      return networkError;
    }

    const { BN } = web3.utils;
    const { amount, npo, durationInDays } = state;
    const trstBalanceBN = new BN(trstBalance);
    const amountBN = new BN(amount);
    if (amountBN.lte(0)) {
      return 'Amount must be positive.';
    }
    if (trstBalanceBN.lt(amountBN)) {
      return 'Your TRST balance is not sufficient.';
    }

    if (!durationInDays) {
      return 'Please select a lock-up duration.';
    }

    if (!npo.stakingId) {
      return 'Please choose your favorite organization.';
    }

    return null;
  }

  renderButton(props, text) {
    const { color, component, onClick, classes } = props;
    return (
      <Grid item xs={10} sm={8} md={4} className={classes.button}>
        <Button
          fullWidth
          color={color}
          onClick={onClick}
          component={component}
          variant="contained"
          size="large"
        >
          {text}
        </Button>
      </Grid>
    );
  }

  renderMessage(message, isError) {
    return (
      <Grid container justify="center">
        <Typography color={isError ? 'error' : 'secondary'} noWrap>
          {message}
        </Typography>
      </Grid>
    );
  }

  renderStatusIcon(currentStatus) {
    let children;
    switch (currentStatus) {
      case status.SUCCESS:
        children = <img src={checkMark} alt="check-mark" />;
        break;
      case status.FAILURE:
        children = <img src={errorMark} alt="error-mark" />;
        break;
      default:
        children = (
          <CircularProgress color="secondary" thickness={8} size={18} />
        );
    }

    return children;
  }

  renderStep(number, text, currentStatus) {
    const { classes } = this.props;
    return (
      <div className={classes.step}>
        <div className={classes.stepIcon}>
          {this.renderStatusIcon(currentStatus)}
        </div>
        <div className={classes.stepMessage}>
          <Typography>{`Step ${number}: ${text}`}</Typography>
        </div>
      </div>
    );
  }

  renderStakingSteps() {
    const { approveTRST, stakeTRST } = this.state;
    return (
      <Grid container justify="center">
        <List>
          {this.renderStep(
            1,
            'Approving TRST transfer.',
            approveTRST.getTxStatus(),
          )}
          {this.renderStep(
            2,
            'Calling Stake contract.',
            stakeTRST.getTxStatus(),
          )}
        </List>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const {
      npo,
      amount,
      durationInDays,
      errorMessage,
      successMessage,
      isStaking,
    } = this.state;
    return (
      <div className={classes.root}>
        <SearchInput onSelected={this.onSelectedNpo} />
        {npo.name && (
          <CauseStakeInfo
            cause={npo}
            amount={amount}
            onChangeAmount={this.onChangeAmount}
            duration={durationInDays}
            onChangeDuration={this.onChangeDuration}
          />
        )}

        <Grid container justify="center" className={classes.stake}>
          {isStaking && this.renderStakingSteps()}
          {errorMessage && this.renderMessage(errorMessage, true)}
          {successMessage && this.renderMessage(successMessage, false)}
          {this.renderButton(
            {
              ...this.props,
              onClick: this.handleStakeNow,
              color: 'primary',
            },
            'Stake Now',
          )}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  networkId: state.networkId,
  trstBalance: state.trstBalance,
  web3: state.web3,
  TRST: state.contracts.TRST,
  TimeLockedStaking: state.contracts.TimeLockedStaking,
});

const mapDispatchToProps = (dispatch) => ({
  refreshStats: (TimeLockedStaking) => {
    dispatchStats(dispatch, TimeLockedStaking);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(StakeNow));
