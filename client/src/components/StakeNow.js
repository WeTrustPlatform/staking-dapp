import React from 'react';
import { connect } from 'react-redux';
import { HashLink as Link } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import TimeLockedStaking from 'Embark/contracts/TimeLockedStaking';
import SearchInput from './SearchInput';
import StakeAmountInput from './StakeAmountInput';
import StakeDurationInput from './StakeDurationInput';
import NPOInfo from './NPOInfo';
import loadContract, { getStakePayload } from './loadContract';
import stateHelper, { status } from './stateHelper';
import { txLink } from './formatter';
import {
  dispatchAccountActivities,
  dispatchOverallStats,
} from './dispatch';

const styles = theme => ({
  root: {
    margin: `${theme.mixins.toolbar.minHeight}px auto`,
    maxWidth: theme.breakpoints.values.md,
  },
  input: {
    padding: theme.spacing.unit * 2,
  },
  button: {
    padding: theme.spacing.unit * 2,
  },
  buttonGrid: {
    marginTop: theme.mixins.toolbar.minHeight / 2,
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
      isStaking: false,
      [stateHelper.tx.approveTRST]: stateHelper.initialState(),
      [stateHelper.tx.stakeTRST]: stateHelper.initialState(),
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
      durationInDays: event.target.value,
    });
  }

  setErrorMessage(err) {
    window.clearTimeout(this.timeOut);
    this.setState({
      errorMessage: err,
    });
    this.timeOut = window.setTimeout(() => this.setState({
      errorMessage: null,
    }), 5000);
  }

  startStaking() {
    this.setState({
      isStaking: true,
    });
    stateHelper.setPending(this, stateHelper.tx.approveTRST);
    stateHelper.setNotStarted(this, stateHelper.tx.stakeTRST);
  }

  handleStakeNow(e) {
    e.preventDefault();

    const inputError = this.validateInput(this.props, this.state);
    if (inputError) {
      this.setErrorMessage(inputError);
      return;
    }

    this.startStaking();

    const { amount, npo, durationInDays } = this.state;
    const { refreshStats, account } = this.props;
    const stakeAmount = web3.utils.toWei(amount.toString(), 'mwei');
    loadContract('TRST')
      .methods
      .approve(TimeLockedStaking.address, stakeAmount)
      .send()
      .once('transactionHash', (approveTxHash) => {
        stateHelper.setTriggered(this, stateHelper.tx.approveTRST, approveTxHash);
        stateHelper.setPending(this, stateHelper.tx.stakeTRST);
        const stakePayload = getStakePayload(durationInDays, npo);
        loadContract('TimeLockedStaking').methods.stake(stakeAmount, stakePayload).send({ gas: '150000' })
          .once('transactionHash', (stakeTxHash) => {
            stateHelper.setTriggered(this, stateHelper.tx.stakeTRST, stakeTxHash);
          })
          .then(() => {
            stateHelper.setSuccess(this, stateHelper.tx.stakeTRST);
            refreshStats(account);
          })
          .catch((err) => {
            stateHelper.setFailure(this, stateHelper.tx.stakeTRST, err);
          });
      })
      .then(() => {
        stateHelper.setSuccess(this, stateHelper.tx.approveTRST);
      })
      .catch((err) => {
        stateHelper.setFailure(this, stateHelper.tx.approveTRST, err);
      });
  }


  validateInput(props, state) {
    const {
      hasWeb3, account, trstBalance, networkId,
    } = props;
    const { amount, npo, durationInDays } = state;

    if (!hasWeb3) {
      return 'Cannot find Web3. Please install metamask.';
    }

    if (!account) {
      return 'Please unlock your account.';
    }

    const { BN } = web3.utils;
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

    if (!npo.ein) {
      return 'Please choose your favorite NPO.';
    }

    if (EmbarkJS.environment === 'testnet'
      && networkId !== '4') {
      return 'Please use Rinkeby network.';
    }

    if (EmbarkJS.environment === 'livenet'
      && networkId !== '1') {
      return 'Please use Main Ethereum network.';
    }

    return null;
  }

  renderGridItem(props, child) {
    const { classes } = props;
    return (
      <Grid
        item
        className={classes.input}
        xs={12}
        sm={12}
        md={6}
      >
        {child}
      </Grid>
    );
  }

  renderButton(props, text) {
    const {
      classes, color, component, onClick,
    } = props;
    return (
      <Grid
        item
        sm={6}
        md={3}
        className={classes.button}
      >
        <Button
          fullWidth
          color={color}
          onClick={onClick}
          component={component}
          variant="contained"
        >
          {text}
        </Button>
      </Grid>
    );
  }

  renderErrorMessage(errorMessage) {
    return (
      <Grid
        container
        justify="center"
      >
        <Typography color="error" noWrap>
          {errorMessage}
        </Typography>
      </Grid>
    );
  }

  renderStatusIcon(currentStatus) {
    let className;
    switch (currentStatus) {
      case status.SUCCESS:
        className = 'fa fa-check-circle';
        break;
      case status.FAILURE:
        className = 'fa fa-exclamation-circle';
        break;
      case status.NOT_STARTED:
        className = 'fa fa-circle';
        break;
      default:
        className = 'fas fa-spinner fa-pulse';
    }

    return (
      <ListItemIcon>
        <Icon className={className} />
      </ListItemIcon>
    );
  }

  renderTxLink(txHash) {
    return (
      <a
        href={txLink(txHash)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ListItemText primary="(view tx)" />
      </a>
    );
  }

  renderStep(number, text, currentStatus, txHash) {
    return (
      <ListItem>
        <ListItemText
          primary={`Step ${number}: ${text}`}
          primaryTypographyProps={{
            variant: 'subtitle1',
          }}
        />
        {this.renderStatusIcon(currentStatus)}
        {txHash && this.renderTxLink(txHash)}
      </ListItem>
    );
  }

  renderStakingSteps() {
    const {
      [stateHelper.tx.approveTRST]: approveTx,
      [stateHelper.tx.stakeTRST]: stakeTx,
    } = this.state;
    return (
      <Grid
        container
        justify="center"
      >
        <List>
          {this.renderStep(1, 'Approve TRST transfer.', approveTx.txStatus, approveTx.txHash)}
          {this.renderStep(2, 'Calling Stake contract.', stakeTx.txStatus, stakeTx.txHash)}
        </List>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const {
      npo, amount, durationInDays, errorMessage, isStaking,
    } = this.state;
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
        >
          {this.renderGridItem(
            this.props,
            <StakeAmountInput
              amount={amount}
              onChange={this.onChangeAmount}
            />,
          )}
          {this.renderGridItem(
            this.props,
            <StakeDurationInput
              duration={durationInDays}
              onChange={this.onChangeDuration}
            />,
          )}
        </Grid>

        <SearchInput onSelected={this.onSelectedNpo} />
        <NPOInfo data={npo} />

        <Grid
          container
          direction="row"
          justify="center"
          className={classes.buttonGrid}
        >
          {isStaking && this.renderStakingSteps()}
          {errorMessage && this.renderErrorMessage(errorMessage)}
          {this.renderButton({
            ...this.props,
            onClick: this.handleStakeNow,
            color: 'primary',
          }, 'Stake Now')}

          {this.renderButton({
            ...this.props,
            component: props => <Link smooth to="#faq-section"><Button {...props} /></Link>,
          }, 'Learn more')}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  networkId: state.networkId,
  trstBalance: state.trstBalance,
  hasWeb3: state.hasWeb3,
});

const mapDispatchToProps = dispatch => ({
  refreshStats: (account) => {
    // call helper
    dispatchAccountActivities(dispatch, account);
    dispatchOverallStats(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StakeNow));
