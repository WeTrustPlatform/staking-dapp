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
    const { onClose, unstakeProcess } = this.props;
    return (
      <DialogBase
        open={unstakeProcess.step === UNSTAKE_WARNING}
        onClose={onClose}
        title="The current rank of your favorite Cause will drop"
        onSubmit={() => this.mockUnstake()}
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
