import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import { trst } from '../formatter';

const styles = (theme) => {
  const lineHeight = 24;
  return {
    subtitle: {
      margin: 'auto',
      minHeight: lineHeight * 2,
      paddingTop: lineHeight,
      maxWidth: theme.breakpoints.values.md / 2,
      [theme.breakpoints.down('sm')]: {
        paddingTop: lineHeight / 2,
      },
    },
    causesStats: {
      paddingTop: lineHeight,
    },
  };
};

class LeaderBoard extends React.Component {
  renderStats(causesStats) {
    const orderedCauses = Object.values(causesStats).sort(
      (a, b) => a.rank - b.rank,
    );
    return orderedCauses.map((c) => {
      return (
        <TableRow>
          <TableCell>{c.rank}</TableCell>
          <TableCell>{c.name}</TableCell>
          <TableCell>{`${trst(c.amount)} TRST`}</TableCell>
          <TableCell>{c.stakers.size}</TableCell>
        </TableRow>
      );
    });
  }

  render() {
    const { title, subtitle, causesStats, classes } = this.props;
    return (
      <div>
        <div>
          <Typography variant="h5">{title}</Typography>
        </div>
        <div className={classes.subtitle}>
          <Typography variant="h6">{subtitle}</Typography>
        </div>
        <div className={classes.causesStats}>
          <Paper>
            <Table padding="dense">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Cause name</TableCell>
                  <TableCell>Staked amount</TableCell>
                  <TableCell>Stakers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{this.renderStats(causesStats)}</TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(LeaderBoard);
