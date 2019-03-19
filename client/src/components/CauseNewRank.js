import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  left: {
    flexGrow: 1,
  },
  right: {
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 12,
    minWidth: 48,
  },
});

class CauseNewRank extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.left}>
          <Typography>New Rank: 20/40</Typography>
        </div>
        <div className={classes.right}>
          <Typography align="center" color="inherit">
            + 2
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CauseNewRank);
