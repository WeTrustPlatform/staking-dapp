import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogBase from './DialogBase';

const styles = (theme) => ({
  step: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  stepIcon: {
    display: 'flex',
    alignSelf: 'center',
    paddingRight: 12,
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
          <div className={classes.stepMessage}>{stepMessage}</div>
        </div>
        {children}
      </DialogBase>
    );
  }
}

export default withStyles(styles)(UnstakeProcessBase);
