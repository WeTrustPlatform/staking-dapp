import React from 'react';
import { connect } from 'react-redux';
import { HashLink as Link } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Section from './Section';
import SectionHeader from './SectionHeader';
import HrefLink from './HrefLink';
import { txLink, trst } from '../formatter';
import UnstakeStatus from './UnstakeStatus';
import UnstakeWarning from './modals/UnstakeWarning';
import UnstakePending from './modals/UnstakePending';
import UnstakeSuccess from './modals/UnstakeSuccess';
import UnstakeFailure from './modals/UnstakeFailure';

const styles = (theme) => {
  const maxWidth = theme.breakpoints.values.lg;
  return {
    paper: {
      width: '100%',
      maxWidth,
      margin: 'auto',
    },
    table: {
      minWidth: maxWidth,
      whiteSpace: 'nowrap',
    },
    nameCell: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: maxWidth / 6,
    },
    txHashCell: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: maxWidth / 10,
    },
    statusCell: {
      minWidth: maxWidth / 5,
    },
    noActivities: {
      padding: theme.mixins.toolbar.minHeight,
      textAlign: 'center',
    },
    row: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.primary.main,
      },
      borderBottomStyle: 'hidden',
    },
  };
};

class YourStakesSection extends React.Component {
  renderNoActivities() {
    const { classes } = this.props;
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <div className={classes.noActivities}>
            {'You have 0 transaction in Your Stakes history. '}
            <Link
              scroll={(el) =>
                el.scrollIntoView({ behavior: 'smooth', block: 'end' })
              }
              to="#main-section"
            >
              Please stake!
            </Link>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  renderActivities(activities) {
    const { classes } = this.props;
    return activities.map((activity) => {
      const {
        id,
        cause,
        amount,
        unlockedAtInContract,
        transactions,
      } = activity;
      const firstStakeTx = transactions.filter((t) => t.event === 'Staked')[0];
      return (
        <TableRow key={id} className={classes.row}>
          <TableCell align="left" className={classes.nameCell}>
            {cause.name || 'Unknown'}
          </TableCell>
          <TableCell align="right">{`${trst(amount)} TRST`}</TableCell>
          <TableCell>{unlockedAtInContract.toLocaleString()}</TableCell>
          <TableCell className={classes.statusCell}>
            <UnstakeStatus activity={activity} />
          </TableCell>
          <TableCell align="left" className={classes.txHashCell}>
            <HrefLink href={txLink(firstStakeTx.transactionHash)}>
              {firstStakeTx.transactionHash}
            </HrefLink>
          </TableCell>
        </TableRow>
      );
    });
  }

  render() {
    const { classes, color, userStats } = this.props;
    const activities = userStats.yourStakes || [];

    return (
      <Section id="activities-section" color={color}>
        <SectionHeader>Your Stakes</SectionHeader>
        <Paper className={classes.paper}>
          <Table className={classes.table} padding="dense">
            <TableHead>
              <TableRow>
                <TableCell>Cause name</TableCell>
                <TableCell>Stake amount</TableCell>
                <TableCell>Locked until</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tx hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.length === 0 && this.renderNoActivities()}
              {activities.length > 0 && this.renderActivities(activities)}
            </TableBody>
          </Table>
        </Paper>
        <UnstakeWarning />
        <UnstakePending />
        <UnstakeSuccess />
        <UnstakeFailure />
      </Section>
    );
  }
}

const mapStateToProps = (state) => ({
  userStats:
    state.usersStats[state.account && state.account.toLowerCase()] || {},
});

export default connect(mapStateToProps)(withStyles(styles)(YourStakesSection));
