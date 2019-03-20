import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { connect } from 'react-redux';

import { trst } from '../formatter';
import accountIcon from '../images/metamask-account-icon.svg';
import { trim, validateNetworkId } from '../utils';

const styles = (theme) => ({
  warning: {
    backgroundColor: '#F6A623',
  },
  error: {
    backgroundColor: '#F6A623',
  },
  accountText: {
    color: theme.palette.text.primary,
    fontSize: 14,
    display: 'inline',
    lineHeight: '16px',
  },
  trstLabel: {
    color: theme.palette.text.muted,
    fontSize: 12,
    display: 'inline',
    lineHeight: '16px',
  },
  accountContainer: {
    alignItems: 'center',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    border: `1px solid #cfcfcf`,
    borderRadius: 4,
  },
  accountImageWrapper: {
    paddingRight: 16,
  },
});

class Web3Account extends React.Component {
  renderNoWeb3(props) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar className={props.classes.error}>
            <Icon>error_outlined</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText secondary="Please install MetaMask" />
      </ListItem>
    );
  }

  renderNoAccount(props) {
    const { networkId } = props;
    const networkError = validateNetworkId(networkId);
    // we can't find account because
    // either they're on wrong network
    // or haven't unlocked account
    const errorMessage = networkError || 'Please log in Metamask';
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar className={props.classes.warning}>
            <Icon>warning</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText secondary={errorMessage} />
      </ListItem>
    );
  }

  renderAccount(props) {
    const { account, trstBalance, classes } = props;

    return (
      <div className={classes.accountContainer}>
        <div className={classes.accountImageWrapper}>
          <img
            width={21}
            height={21}
            src={accountIcon}
            alt="metamask account icon"
          />
        </div>
        <div>
          <Typography className={classes.accountText}>
            {trim(account)}
          </Typography>
          <div>
            <Typography
              component="span"
              className={`${classes.accountText} ${classes.trstLabel}`}
            >
              TRST:
            </Typography>
            <Typography component="span" className={classes.accountText}>
              {' '}
              {trst(trstBalance)}
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { web3, account } = this.props;
    const hasWeb3Browser = web3 && web3.givenProvider;
    return (
      <List>
        {!hasWeb3Browser && this.renderNoWeb3(this.props)}
        {hasWeb3Browser && !account && this.renderNoAccount(this.props)}
        {hasWeb3Browser && account && this.renderAccount(this.props)}
      </List>
    );
  }
}

const mapStateToProps = (state) => ({
  web3: state.web3,
  account: state.account,
  networkId: state.networkId,
  trstBalance: state.trstBalance,
});

export default connect(mapStateToProps)(withStyles(styles)(Web3Account));
