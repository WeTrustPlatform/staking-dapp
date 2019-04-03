import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import StakeAmountInput from './StakeAmountInput';
import StakeDurationInput from './StakeDurationInput';
import CauseInfo from './CauseInfo';
import CauseNewRank from './CauseNewRank';

const styles = (theme) => ({
  gridRowItems: {
    padding: theme.spacing.unit * 2,
  },
});

class CauseStakeInfo extends React.Component {
  renderGridItem(child) {
    const { classes } = this.props;
    return (
      <Grid item className={classes.gridRowItems} xs={12} sm={12} md={6}>
        {child}
      </Grid>
    );
  }

  render() {
    const {
      cause,
      amount,
      onChangeAmount,
      duration,
      onChangeDuration,
    } = this.props;
    return (
      <Paper>
        <CauseInfo cause={cause} />
        <Grid container justify="center">
          {this.renderGridItem(
            <div>
              <StakeAmountInput amount={amount} onChange={onChangeAmount} />
              <CauseNewRank amount={amount} cause={cause} />
            </div>,
          )}
          {this.renderGridItem(
            <StakeDurationInput
              duration={duration}
              onChange={onChangeDuration}
            />,
          )}
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(styles)(CauseStakeInfo);
