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
import SearchInput from './SearchInput';
import StakeAmountInput from './StakeAmountInput';
import StakeDurationInput from './StakeDurationInput';
import NPOInfo from './NPOInfo';
import { getStakePayload, validateNetworkId } from '../utils';
import stateHelper, { status } from './stateHelper';
import { txLink } from '../formatter';
import {
  dispatchAccountActivities,
  dispatchOverallStats,
} from '../dispatch';

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
    this.timeOut = window.setTimeout(() => this.setState({
      errorMessage: null,
    }), 5000);
  }

  startStaking() {
    this.setState({
      isStaking: true,
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

    const {
      amount, npo, durationInDays, approveTRST, stakeTRST,
    } = this.state;

    const {
      web3, refreshStats, account, TRST, TimeLockedStaking,
    } = this.props;

    const stakeAmount = web3.utils.toWei(amount.toString(), 'mwei');

    TRST.methods
      .approve(TimeLockedStaking.options.address, stakeAmount)
      .send({ from: account })
      .once('transactionHash', (approveTxHash) => {
        approveTRST.setTriggered(approveTxHash);
        stakeTRST.setPending();
        const stakePayload = getStakePayload(durationInDays, npo);
        TimeLockedStaking.methods.stake(stakeAmount, stakePayload).send({ from: account })
          .once('transactionHash', (stakeTxHash) => {
            stakeTRST.setTriggered(stakeTxHash);
          })
          .then(() => {
            stakeTRST.setSuccess();
            refreshStats(account, TimeLockedStaking);
          })
          .catch((err) => {
            stakeTRST.setFailure(err);
          });
      })
      .then(() => {
        approveTRST.setSuccess();
      })
      .catch((err) => {
        approveTRST.setFailure(err);
      });
  }


  validateInput(props, state) {
    const {
      web3, account, trstBalance, networkId,
    } = props;


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

    if (!npo.ein) {
      return 'Please choose your favorite NPO.';
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
      approveTRST,
      stakeTRST,
    } = this.state;
    return (
      <Grid
        container
        justify="center"
      >
        <List>
          {this.renderStep(1, 'Approving TRST transfer.', approveTRST.getTxStatus(), approveTRST.getTxHash())}
          {this.renderStep(2, 'Calling Stake contract.', stakeTRST.getTxStatus(), stakeTRST.getTxHash())}
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
  web3: state.web3,
  TRST: state.contracts.TRST,
  TimeLockedStaking: state.contracts.TimeLockedStaking,
});

const mapDispatchToProps = dispatch => ({
  refreshStats: (account, TimeLockedStaking) => {
    // call helper
    dispatchAccountActivities(dispatch, TimeLockedStaking, account);
    dispatchOverallStats(dispatch, TimeLockedStaking);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(StakeNow));
