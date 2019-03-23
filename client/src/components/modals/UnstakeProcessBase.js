import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DialogBase from './DialogBase';
import { unstakeExit } from '../../actions';

const styles = (theme) => ({
  step: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
  },
  stepIcon: {
    display: 'flex',
    alignSelf: 'center',
    paddingRight: 12,
  },
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
      onClose,
    } = this.props;
    return (
      <DialogBase
        open={open}
        onClose={onClose}
        onSubmit={onClose}
        title="Processing"
        action="Back to Staking site"
      >
        <div className={classes.step}>
          <div className={classes.stepIcon}>{stepIcon}</div>
          <div className={classes.stepMessage}>
            <Typography>{stepMessage}</Typography>
          </div>
        </div>
        <div className={classes.message}>{children}</div>
      </DialogBase>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(unstakeExit()),
});

export default connect(
  null,
  mapDispatchToProps,
)(withStyles(styles)(UnstakeProcessBase));
