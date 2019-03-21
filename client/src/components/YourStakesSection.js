import React from 'react';
import { connect } from 'react-redux';
import { HashLink as Link } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
import { validateNetworkId } from '../utils';
import dispatchStats from '../dispatchStats';

const styles = (theme) => {
  const maxWidth = theme.breakpoints.values.lg;
  return {
    paper: {
      width: '100%',
      maxWidth,
      margin: 'auto',
    },
    table: {
      minWidth: 700,
    },
    txHashCell: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: maxWidth / 10,
    },
    statusCell: {
      minWidth: maxWidth / 5,
    },
    noActivities: {
      padding: theme.mixins.toolbar.minHeight,
      textAlign: 'center',
    },
    statusLocked: {
      fontWeight: 600,
      color: theme.palette.text.disabled,
    },
    row: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.primary.main,
      },
      borderBottomStyle: 'hidden',
    },
    unstakeButton: {
      fontWeight: 600,
      minWidth: maxWidth / 7.5,
      height: 32,
    },
  };
};

class YourStakesSection extends React.Component {
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
      .unstake(amount, stakeData)
      .send({ from: account })
      .finally(() => {
        this.setState({
          isUnstaking: false,
        });
        refreshStats(TimeLockedStaking);
      });
  }

  renderUnstake(activity) {
    const { classes, networkId } = this.props;
    const { isUnstaking } = this.state;
    const { canUnstake, amount, stakeData } = activity;
    const isEnabled =
      canUnstake && !isUnstaking && !validateNetworkId(networkId);
    return (
      <div className={classes.unstake}>
        {canUnstake && (
          <Button
            color="primary"
            variant="contained"
            disabled={!isEnabled}
            className={classes.unstakeButton}
            onClick={() => this.handleUnstake(amount.toString(), stakeData)}
          >
            Claim TRST
          </Button>
        )}
        {!canUnstake && (
          <Typography className={classes.statusLocked}>Locked</Typography>
        )}
      </div>
    );
  }

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
          <TableCell align="left">{cause.name || 'Unknown'}</TableCell>
          <TableCell align="right">{`${trst(amount)} TRST`}</TableCell>
          <TableCell>{unlockedAtInContract.toLocaleString()}</TableCell>
          <TableCell className={classes.statusCell}>
            {this.renderUnstake(activity)}
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
      </Section>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.account,
  networkId: state.networkId,
  accountActivities: state.accountActivities || [],
  userStats:
    state.usersStats[state.account && state.account.toLowerCase()] || {},
  TimeLockedStaking: state.contracts.TimeLockedStaking,
});

const mapDispatchToProps = (dispatch) => ({
  refreshStats: (TimeLockedStaking) => {
    dispatchStats(dispatch, TimeLockedStaking);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(YourStakesSection));
