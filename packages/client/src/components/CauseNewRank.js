import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { getCauseRank, getNewRank } from '../utils';
import { convertAmountToSmallestTRST } from '../formatter';

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
  render() {
    const { classes, causesStats, cause, amount } = this.props;
    const currentRank = getCauseRank(cause, causesStats);
    // check if amount is valid
    let amountToStake;
    try {
      amountToStake = convertAmountToSmallestTRST(amount);
    } catch {
      // don't render
      return null;
    }
    const newRank = getNewRank(cause, causesStats, amountToStake);
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
