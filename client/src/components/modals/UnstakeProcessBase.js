import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DialogBase from './DialogBase';

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
  children: {
    margin: theme.spacing.unit * 2,
  },
});

class UnstakeProcessBase extends React.Component {
  render() {
    const {
      open,
      onClose,
      onSubmit,
      action,
      stepIcon,
      stepMessage,
      children,
      classes,
    } = this.props;
    return (
      <DialogBase
        open={open}
        onClose={onClose}
        title="Processing"
        onSubmit={onSubmit}
        action={action}
      >
        <div className={classes.step}>
          <div className={classes.stepIcon}>{stepIcon}</div>
          <div className={classes.stepMessage}>
            <Typography>{stepMessage}</Typography>
          </div>
        </div>
        <div className={classes.children}>{children}</div>
      </DialogBase>
    );
  }
}

export default withStyles(styles)(UnstakeProcessBase);
