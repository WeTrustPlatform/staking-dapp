import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { validateNetworkId } from '../utils';
import {
  UNSTAKE_WARNING,
  UNSTAKE_PENDING,
  UNSTAKE_SUCCESS,
  UNSTAKE_FAILURE,
  unstake,
} from '../actions';
import dispatchStats from '../dispatchStats';

const styles = (theme) => {
  const maxWidth = theme.breakpoints.values.lg;
  return {
    button: {
      fontWeight: 600,
      minWidth: maxWidth / 7.5,
      height: 32,
    },
    statusLocked: {
      fontWeight: 600,
      color: theme.palette.text.disabled,
    },
  };
};

class UnstakeStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUnstaking: false,
    };
  }

  handleUnstake(amount, stakeData) {
    const { TimeLockedStaking, account, refreshStats } = this.props;
    this.setState({
      isUnstaking: true,
    });

    TimeLockedStaking.methods
      .unstake(amount, stakeData)
      .send({ from: account })
      .finally(() => {
        this.setState({
          isUnstaking: false,
        });
        refreshStats(TimeLockedStaking);
      });
  }

  render() {
    const { classes, networkId, activity } = this.props;
    const { isUnstaking } = this.state;
    const { canUnstake, amount, stakeData } = activity;
    const isEnabled =
      canUnstake && !isUnstaking && !validateNetworkId(networkId);
    return (
      <div>
        {canUnstake && (
          <Button
            color="primary"
            variant="contained"
            disabled={!isEnabled}
            className={classes.button}
            onClick={() => this.handleUnstake(amount.toString(), stakeData)}
          >
            Claim TRST
          </Button>
        )}
        {!canUnstake && (
          <Typography className={classes.statusLocked}>Locked</Typography>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  networkId: state.networkId,
  unstake: state.unstake,
  TimeLockedStaking: state.contracts.TimeLockedStaking,
});

const mapDispatchToProps = (dispatch) => ({
  unstakeWarning: (activityId) =>
    dispatch(unstake(UNSTAKE_WARNING, activityId)),
  unstakePending: (activityId) =>
    dispatch(unstake(UNSTAKE_PENDING, activityId)),
  unstakeSuccess: (activityId) =>
    dispatch(unstake(UNSTAKE_SUCCESS, activityId)),
  unstakeFailure: (activityId) =>
    dispatch(unstake(UNSTAKE_FAILURE, activityId)),
  refreshStats: (TimeLockedStaking) => {
    dispatchStats(dispatch, TimeLockedStaking);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(UnstakeStatus));
