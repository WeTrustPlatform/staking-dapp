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

class UnstakeWarning extends React.Component {
  handleUnstake() {
    const {
      TimeLockedStaking,
      account,
      refreshStats,
      activity,
      onSuccess,
      onFailure,
    } = this.props;
    const { stakeData, amount, id } = activity;

    TimeLockedStaking.methods
      .unstake(amount.toString(), stakeData)
      .send({ from: account })
      .then(() => {
        onSuccess(id);
        refreshStats(TimeLockedStaking);
      })
      .catch(() => {
        onFailure(id);
      });
  }

  render() {
    const { onClose, onSubmit, unstakeProcess } = this.props;
    return (
      <DialogBase
        open={unstakeProcess.step === UNSTAKE_WARNING}
        onClose={onClose}
        title="The current rank of your favorite Cause will drop"
        onSubmit={() => onSubmit(unstakeProcess.activityId)}
        action="Continue"
      >
        <Typography>
          By claiming back 3,000 TRST, Lava Mae rank will drop to 23.
        </Typography>
      </DialogBase>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  networkId: state.networkId,
  unstakeProcess: state.unstakeProcess,
  TimeLockedStaking: state.contracts.TimeLockedStaking,
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(unstakeExit()),
  onSubmit: (activityId) => dispatch(unstake(UNSTAKE_PENDING, activityId)),
  onSuccess: (activityId) => dispatch(unstake(UNSTAKE_SUCCESS, activityId)),
  onFailure: (activityId) => dispatch(unstake(UNSTAKE_FAILURE, activityId)),
  refreshStats: (TimeLockedStaking) =>
    dispatchStats(dispatch, TimeLockedStaking),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnstakeWarning);
