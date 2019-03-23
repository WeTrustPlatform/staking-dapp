import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import DialogBase from './DialogBase';
import {
  UNSTAKE_WARNING,
  UNSTAKE_PENDING,
  UNSTAKE_SUCCESS,
  UNSTAKE_FAILURE,
  unstake,
  unstakeExit,
} from '../../actions';
import dispatchStats from '../../dispatchStats';
import { trst, bigNumber } from '../../formatter';
import { getNewRank } from '../../utils';

class UnstakeWarning extends React.Component {
  handleUnstake() {
    const {
      TimeLockedStaking,
      account,
      refreshStats,
      onSuccess,
      onFailure,
      onStake,
      unstakeProcess,
    } = this.props;
    const { activity } = unstakeProcess;
    const { stakeData, amount } = activity;

    TimeLockedStaking.methods
      .unstake(amount.toString(), stakeData)
      .send({ from: account })
      .then(() => {
        onSuccess(activity);
        refreshStats(TimeLockedStaking);
      })
      .catch(() => {
        onFailure(activity);
      });

    onStake(activity);
  }

  mockUnstake() {
    const { onStake, unstakeProcess } = this.props;
    onStake(unstakeProcess.activity);
  }

  render() {
    const { onClose, unstakeProcess, causesStats } = this.props;
    const { step, activity } = unstakeProcess;
    const newRank =
      activity &&
      getNewRank(
        activity.cause,
        causesStats,
        bigNumber(activity.amount || 0).neg(),
      );
    return (
      <DialogBase
        open={step === UNSTAKE_WARNING}
        onClose={onClose}
        title="The current rank of your favorite Cause will drop"
        onSubmit={() => this.mockUnstake()}
        action="Continue"
      >
        <Typography>
          {`By claiming back ${trst(
            activity.amount || 0,
          )} TRST, the ${activity.cause &&
            activity.cause.name}'s rank will drop to ${newRank}.`}
        </Typography>
      </DialogBase>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  causesStats: state.causesStats,
  unstakeProcess: state.unstakeProcess,
  TimeLockedStaking: state.contracts.TimeLockedStaking,
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(unstakeExit()),
  onStake: (activity) => dispatch(unstake(UNSTAKE_PENDING, activity)),
  onSuccess: (activity) => dispatch(unstake(UNSTAKE_SUCCESS, activity)),
  onFailure: (activity) => dispatch(unstake(UNSTAKE_FAILURE, activity)),
  refreshStats: (TimeLockedStaking) =>
    dispatchStats(dispatch, TimeLockedStaking),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnstakeWarning);
