import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Loading from './Loading';
import { convertToWholeTRSTForView } from '../formatter';
import { validateNetworkId } from '../utils';

const styles = (theme) => {
  const lineHeight = 24;
  const maxWidth = theme.breakpoints.values.lg / 2;
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
    name: {
      paddingRight: theme.spacing.unit,
      paddingLeft: theme.spacing.unit,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: maxWidth / 4,
    },
    stakedAmount: {
      minWidth: maxWidth / 5,
    },
    tableBody: {
      height: 96,
      tableLayout: 'fixed',
      overflow: 'auto',
    },
    row: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.primary.main,
      },
      borderBottomStyle: 'hidden',
    },
  };
};

class LeaderBoard extends React.Component {
  renderStats(causesStats) {
    const { classes, networkId } = this.props;
    if (
      Object.keys(causesStats).length === 0 &&
      !validateNetworkId(networkId)
    ) {
      return (
        <TableRow>
          <TableCell colSpan={4}>
            <Loading />
          </TableCell>
        </TableRow>
      );
    }

    const orderedCauses = Object.values(causesStats).sort(
      (a, b) => a.rank - b.rank,
    );

    const rows = [];
    for (let i = 0; i < 5; i += 1) {
      const c = orderedCauses[i] || {
        rank: '',
        name: '',
      };
      // c.amount is a bigNumber and bigNumber(0) is truthy
      // i.e. !c.amount then line is empty
      rows.push(
        <TableRow key={i} className={classes.row}>
          <TableCell>{c.rank}</TableCell>
          <TableCell className={classes.name}>{c.name}</TableCell>
          <TableCell className={classes.stakedAmount}>
            {c.amount ? `${convertToWholeTRSTForView(c.amount)} TRST` : ''}
          </TableCell>
          <TableCell>{c.amount ? c.stakers && c.stakers.size : ''}</TableCell>
        </TableRow>,
      );
    }
    return rows;
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
            <Table padding="none">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Cause name</TableCell>
                  <TableCell>Staked amount</TableCell>
                  <TableCell>Stakers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {this.renderStats(causesStats)}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  networkId: state.networkId,
});

export default connect(mapStateToProps)(withStyles(styles)(LeaderBoard));
