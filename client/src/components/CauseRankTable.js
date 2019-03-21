import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import { trst } from '../formatter';

const styles = (theme) => ({
  root: {
    overflowX: 'auto',
  },
  table: {
    tableLayout: 'fixed',
  },
  header: {
    color: theme.palette.text.primary,
  },
});
class CauseRankTable extends React.Component {
  render() {
    const { classes, stats } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table} padding="dense">
          <TableHead>
            <TableRow>
              <TableCell classes={{ head: classes.header }}>
                Current rank
              </TableCell>
              <TableCell classes={{ head: classes.header }}>
                Staked amount
              </TableCell>
              <TableCell classes={{ head: classes.header }}>Stakers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{stats.rank || 0}</TableCell>
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

export default withStyles(styles)(CauseRankTable);
