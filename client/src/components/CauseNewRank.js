import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  left: {
    flexGrow: 1,
  },
  right: {
    marginRight: theme.spacing.unit * 2,
  },
  badge: {
    boxSizing: 'inherit',
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
          <Badge
            classes={{
              badge: classes.badge,
            }}
            badgeContent=" + 2 "
            color="secondary"
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CauseNewRank);
