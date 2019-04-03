import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import StepStatus from './StepStatus';
import HrefLink from './HrefLink';
import { trst, txLink, bigNumber } from '../formatter';
import { validateNetworkId } from '../utils';
import {
  UNSTAKE_PENDING_BACKGROUND,
  UNSTAKE_WARNING,
  unstake,
} from '../actions';

const styles = (theme) => {
  const maxWidth = theme.breakpoints.values.lg;
  return {
    button: {
      fontWeight: 600,
      minWidth: maxWidth / 7.5,
      height: 32,
    },
    locked: {
      fontWeight: 600,
      color: theme.palette.text.disabled,
    },
  };
};

class UnstakeStatus extends React.Component {
  renderClaimedMessage(txHash) {
    return (
      <Typography noWrap>
        <strong>Claimed - </strong>
        <HrefLink href={txLink(txHash)}>{txHash}</HrefLink>
      </Typography>
    );
  }

  renderClaimed() {
    const { activity } = this.props;
    // assume users only use our UI for staking and unstaking
    const unstakeTx =
      activity &&
      activity.transactions &&
      activity.transactions.filter((t) => t.event === 'Unstaked')[0];
    const balanceZero =
      activity && activity.amount && bigNumber(0).eq(activity.amount);
    return (
      balanceZero &&
      unstakeTx &&
      this.renderClaimedMessage(unstakeTx.transactionHash)
    );
  }

  // render this if there's a successful tx that is cached
  // because `refreshStates` may takes a while to pick up new transaction
  renderSuccess() {
    const { unstakeSuccessCache, activity } = this.props;
    const { txHash, activityId } = unstakeSuccessCache;
    return (
      activity &&
      activityId === activity.id &&
      this.renderClaimedMessage(txHash)
    );
  }

  renderProcessing() {
    const { unstakeProcess, activity } = this.props;
    const { step, activity: processing } = unstakeProcess;
    return (
      processing &&
      processing.id === activity.id &&
      step === UNSTAKE_PENDING_BACKGROUND && (
        <StepStatus
          stepIcon={
            <CircularProgress color="secondary" thickness={8} size={18} />
          }
          stepMessage={`Claiming ${trst(
            activity.amount,
          )} TRST. Waiting for MetaMask.`}
        />
      )
    );
  }

  render() {
    const { classes, networkId, activity, unstakeProcess, warn } = this.props;
    const { canUnstake } = activity;
    const isClickable =
      canUnstake && !unstakeProcess.step && !validateNetworkId(networkId);
    return (
      <div>
        {canUnstake &&
          (this.renderProcessing() || this.renderSuccess() || (
            <Button
              color="primary"
              variant="contained"
              disabled={!isClickable}
              className={classes.button}
              onClick={() => warn(activity)}
            >
              Claim TRST
            </Button>
          ))}
        {!canUnstake &&
          (this.renderClaimed() || (
            <Typography className={classes.locked}>Locked</Typography>
          ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  unstakeProcess: state.unstakeProcess,
  unstakeSuccessCache: state.unstakeSuccessCache,
});

const mapDispatchToProps = (dispatch) => ({
  warn: (activity) => dispatch(unstake(UNSTAKE_WARNING, activity)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(UnstakeStatus));
