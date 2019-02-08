import React from 'react';
import { connect } from 'react-redux';
import { HashLink as Link } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Section from './Section';
import SectionHeader from './SectionHeader';
import { txLink } from '../formatter';
import { validateNetworkId } from '../utils';
import {
  dispatchAccountActivities,
  dispatchOverallStats,
} from '../dispatch';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    maxWidth: theme.breakpoints.values.lg,
    margin: 'auto',
  },
  table: {
    minWidth: 700,
  },
  txHashCell: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: theme.breakpoints.values.lg / 5,
  },
  noActivities: {
    padding: theme.mixins.toolbar.minHeight,
    textAlign: 'center',
  },
  unstake: {
  },
});


class ActivitiesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUnstaking: false,
    };
  }

  handleUnstake(amount, stakeData) {
    const { TimeLockedStaking, account, refreshStats } = this.props;
    this.setState({
      isUnstaking: true,
    });

    TimeLockedStaking.methods
      .unstake(amount, stakeData).send({ from: account })
      .finally(() => {
        this.setState({
          isUnstaking: false,
        });
        refreshStats(account, TimeLockedStaking);
      });
  }

  renderUnstake(event) {
    const { classes, networkId } = this.props;
    const { isUnstaking } = this.state;
    const { canUnstake, rawAmount, stakeData } = event;
    const isEnabled = canUnstake && !isUnstaking && !validateNetworkId(networkId);
    return (
      <div className={classes.unstake}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isEnabled}
          onClick={() => this.handleUnstake(rawAmount.toString(), stakeData)}
        >
          Unstake
        </Button>
      </div>
    );
  }

  renderNoActivities() {
    const { classes } = this.props;
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <div className={classes.noActivities}>
            It looks so empty.
            {' '}
            <Link
              scroll={el => el.scrollIntoView({ behavior: 'smooth', block: 'end' })}
              to="#main-section"
            >
              Please stake!
            </Link>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  renderActivities() {
    const { classes, accountActivities } = this.props;
    return (
      accountActivities.map((event) => {
        const {
          id, name, amount, unlockedAt, transactionHash,
        } = event;
        return (
          <TableRow key={id}>
            <TableCell>
              {name}
            </TableCell>
            <TableCell>
              {amount}
            </TableCell>
            <TableCell>
              {unlockedAt.toLocaleString()}
            </TableCell>
            <TableCell>
              {this.renderUnstake(event)}
            </TableCell>
            <TableCell className={classes.txHashCell}>
              <a
                href={txLink(transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {transactionHash}
              </a>
            </TableCell>
          </TableRow>
        );
      }));
  }

  render() {
    const {
      classes, color, accountActivities: activities,
    } = this.props;

    return (
      <Section id="activities-section" color={color}>
        <SectionHeader>Activities</SectionHeader>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>
                  NPO Name
                </TableCell>
                <TableCell>
                  Amount (TRST)
                </TableCell>
                <TableCell>
                  Locked Until
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
                <TableCell>
                  Transaction Hash
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.length === 0 && this.renderNoActivities()}
              {activities.length > 0 && this.renderActivities()}
            </TableBody>
          </Table>
        </Paper>
      </Section>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  networkId: state.networkId,
  accountActivities: state.accountActivities || [],
  TimeLockedStaking: state.contracts.TimeLockedStaking,
});

const mapDispatchToProps = dispatch => ({
  refreshStats: (account, TimeLockedStaking) => {
    dispatchAccountActivities(dispatch, TimeLockedStaking, account);
    dispatchOverallStats(dispatch, TimeLockedStaking);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ActivitiesSection));
