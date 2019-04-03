import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import DialogBase from './DialogBase';
import {
  UNSTAKE_PENDING_BACKGROUND,
  UNSTAKE_PENDING,
  unstake,
  unstakeExit,
} from '../../actions';
import StepStatus from '../StepStatus';

const styles = (theme) => ({
  message: {
    marginTop: theme.spacing.unit * 3,
  },
});

class UnstakeProcessBase extends React.Component {
  render() {
    const {
      open,
      stepIcon,
      stepMessage,
      children,
      classes,
      unstakeProcess,
      exit,
      sendToBackground,
    } = this.props;

    const { step, activity } = unstakeProcess;

    // determine close behavior
    const onClose =
      step !== UNSTAKE_PENDING_BACKGROUND && step !== UNSTAKE_PENDING
        ? exit
        : () => sendToBackground(activity);

    return (
      <DialogBase
        open={open}
        onClose={onClose}
        onSubmit={onClose}
        title="Processing"
        action="Back to Staking site"
      >
        <StepStatus stepIcon={stepIcon} stepMessage={stepMessage} />
        <div className={classes.message}>{children}</div>
      </DialogBase>
    );
  }
}

const mapStateToProps = (state) => ({
  unstakeProcess: state.unstakeProcess,
});

const mapDispatchToProps = (dispatch) => ({
  exit: () => dispatch(unstakeExit()),
  sendToBackground: (activity) =>
    dispatch(unstake(UNSTAKE_PENDING_BACKGROUND, activity)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(UnstakeProcessBase));
