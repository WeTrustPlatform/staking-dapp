import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getCauseRank } from '../utils';
import { bigNumber } from '../formatter';

const styles = (theme) => ({
  row: {
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
    const { classes, amount, causesStats, cause } = this.props;
    const stats = causesStats[cause.stakingId] || {};
    const currentStakedAmount = stats.amount || bigNumber(0);
    const currentRank = getCauseRank(cause, causesStats);

    const amountInSmallestUnit = bigNumber(amount).mul(bigNumber(1e6));
    const newStakedAmount = currentStakedAmount.add(amountInSmallestUnit);
    const newCausesStats = Object.assign({}, causesStats, {
      [cause.stakingId]: {
        amount: newStakedAmount,
        rank: 0,
        isOnSpring: !!cause.isOnSpring,
      },
    });
    const newRank = getCauseRank(cause, newCausesStats);
    const increased = currentRank - newRank;
    return (
      <div>
        <div className={classes.row}>
          <div className={classes.left}>
            <Typography>{`New Rank: ${newRank}`}</Typography>
          </div>
          <div className={classes.right}>
            <Typography align="center" color="inherit">
              {`+ ${increased}`}
            </Typography>
          </div>
        </div>
        {currentRank > 1 && increased === 0 && (
          <div className={classes.row}>
            <Typography>
              {"Not enough TRST to push cause's rank. Please stake more."}
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  causesStats: state.causesStats,
});

export default connect(mapStateToProps)(withStyles(styles)(CauseNewRank));
