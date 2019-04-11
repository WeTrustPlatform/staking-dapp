import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
  root: {
    padding: theme.mixins.toolbar.minHeight,
    textAlign: 'center',
  },
});

class Loading extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CircularProgress thickness={6} color="secondary" />
        <p>This might take several minutes</p>
      </div>
    );
  }
}

export default withStyles(styles)(Loading);
