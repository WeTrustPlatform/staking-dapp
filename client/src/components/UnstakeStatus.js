import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { validateNetworkId } from '../utils';
import { UNSTAKE_WARNING, unstake } from '../actions';

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
  render() {
    const { classes, networkId, activity, unstakeProcess, warn } = this.props;
    const { canUnstake } = activity;
    const isEnabled =
      canUnstake && !unstakeProcess.step && !validateNetworkId(networkId);
    return (
      <div>
        {canUnstake && (
          <Button
            color="primary"
            variant="contained"
            disabled={!isEnabled}
            className={classes.button}
            onClick={() => warn(activity)}
          >
            Claim TRST
          </Button>
        )}
        {!canUnstake && (
          <Typography className={classes.locked}>Locked</Typography>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  unstakeProcess: state.unstakeProcess,
});

const mapDispatchToProps = (dispatch) => ({
  warn: (activity) => dispatch(unstake(UNSTAKE_WARNING, activity)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(UnstakeStatus));
