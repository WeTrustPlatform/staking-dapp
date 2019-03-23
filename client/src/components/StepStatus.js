import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
});

class StepStatus extends React.Component {
  render() {
    const { classes, stepIcon, stepMessage } = this.props;
    return (
      <div className={classes.step}>
        <div className={classes.stepIcon}>{stepIcon}</div>
        <div className={classes.stepMessage}>
          <Typography>{stepMessage}</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(StepStatus);
