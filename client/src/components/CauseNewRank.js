import React from 'react';
import cx from 'classnames';
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
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    borderRadius: 12,
    minWidth: 48,
  },
  notEnough: {
    color: theme.palette.text.disabled,
  },
  increased: {
    backgroundColor: theme.palette.secondary.main,
  },
});

class CauseNewRank extends React.Component {
  getNewRank() {
    const { amount, causesStats, cause } = this.props;
    const stats = causesStats[cause.stakingId] || {};
    const currentStakedAmount = stats.amount || bigNumber(0);

    const creditingAmount = bigNumber(amount).mul(bigNumber(1e6));
    const newStakedAmount = currentStakedAmount.add(creditingAmount);

    const newCausesStats = Object.assign({}, causesStats, {
      [cause.stakingId]: {
        amount: newStakedAmount,
        rank: 0,
        isOnSpring: !!cause.isOnSpring,
      },
    });
    const newRank = getCauseRank(cause, newCausesStats);
    return newRank;
  }

  render() {
    const { classes, causesStats, cause } = this.props;
    const currentRank = getCauseRank(cause, causesStats);
    const newRank = this.getNewRank();
    const increased = currentRank - newRank;
    const hasStakedBefore = !!causesStats[cause.stakingId];
    return (
      <div>
        <div className={classes.row}>
          <div className={classes.left}>
            <Typography>{`New Rank: ${newRank}`}</Typography>
          </div>
          {hasStakedBefore && (
            <div
              className={cx(
                classes.right,
                increased > 0 ? classes.increased : null,
              )}
            >
              <Typography align="center" color="inherit">
                {`+ ${increased}`}
              </Typography>
            </div>
          )}
        </div>
        {currentRank > 1 && hasStakedBefore && increased === 0 && (
          <div className={classes.row}>
            <Typography className={classes.notEnough}>
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
