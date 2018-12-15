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
import { txLink } from './formatter';

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
    maxWidth: theme.breakpoints.values.lg / 4,
  },
  noActivities: {
    padding: theme.mixins.toolbar.minHeight,
    textAlign: 'center',
  },
  unstake: {
    margin: `${theme.mixins.toolbar.minHeight}px auto`,
    textAlign: 'center',
  },
});


class ActivitiesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canUnstake: false,
    };
  }

  renderNoActivities() {
    const { classes } = this.props;
    return (
      <TableRow>
        <TableCell colSpan={4}>
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
      accountActivities.map(event => (
        <TableRow key={event.id}>
          <TableCell>
            {event.name}
          </TableCell>
          <TableCell>
            {event.amount}
          </TableCell>
          <TableCell>
            {event.lockedUntil}
          </TableCell>
          <TableCell className={classes.txHashCell}>
            <a
              href={txLink(event.transactionHash)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.transactionHash}
            </a>
          </TableCell>
        </TableRow>
      )));
  }

  renderUnstake() {
    const { classes } = this.props;
    return (
      <div className={classes.unstake}>
        <Button
          variant="contained"
          color="disabled"
          disabled
        >
            Unstake
        </Button>
      </div>
    );
  }

  render() {
    const {
      classes, color, accountActivities: activities,
    } = this.props;
    const { canUnstake } = this.state;

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
        { canUnstake && this.renderUnstake() }
      </Section>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  networkId: state.networkId,
  hasWeb3: state.hasWeb3,
  accountActivities: state.accountActivities,
});

export default connect(mapStateToProps)(withStyles(styles)(ActivitiesSection));
