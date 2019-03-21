import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import { trst } from '../formatter';
import { getCauseRank } from '../utils';

const styles = (theme) => ({
  table: {
    tableLayout: 'fixed',
  },
  header: {
    color: theme.palette.text.primary,
  },
});

class CauseRankTable extends React.Component {
  getRankHeader(cause) {
    return cause.isOnSpring ? 'Spring rank' : 'Nomination Rank';
  }

  render() {
    const { classes, cause, causesStats } = this.props;
    const stats = causesStats[cause.stakingId] || {};
    return (
      <Paper>
        <Table className={classes.table} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell classes={{ head: classes.header }}>
                {this.getRankHeader(cause)}
              </TableCell>
              <TableCell classes={{ head: classes.header }}>
                Staked amount
              </TableCell>
              <TableCell classes={{ head: classes.header }}>Stakers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{getCauseRank(cause, causesStats)}</TableCell>
              <TableCell>{`${trst(stats.amount || 0)} TRST`}</TableCell>
              <TableCell>
                {(stats.stakers && stats.stakers.size) || 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  causesStats: state.causesStats,
});

export default connect(mapStateToProps)(withStyles(styles)(CauseRankTable));
