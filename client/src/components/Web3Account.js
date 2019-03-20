import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { connect } from 'react-redux';

import configs from '../configs';
import { trst } from '../formatter';
import metamaskIcon from '../images/meta-mask-logo.png';
import accountIcon from '../images/metamask-account-icon.svg';
import { trim } from '../utils';

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

const NETWORK_MAP = {
  '1': 'MainNet',
  '2': 'Morden',
  '3': 'Ropsten',
  '4': 'Rinkeby',
  '5': 'Goerli',
  '42': 'Kovan',
};

const networkName = NETWORK_MAP[configs.NETWORK_ID] || 'Custom network';

class Web3Account extends React.Component {
  renderNoAccount(props) {
    const { classes } = props;

    return (
      <div className={classes.accountContainer}>
        <div className={classes.accountImageWrapper}>
          <img
            width={21}
            height={21}
            src={metamaskIcon}
            alt="metamask fox icon"
          />
        </div>
        <div>
          <Typography className={classes.accountText}>
            {`Connect to ${networkName}`}
          </Typography>
        </div>
      </div>
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
    const isConnected = hasWeb3Browser && account;

    return (
      <List>
        {isConnected
          ? this.renderAccount(this.props)
          : this.renderNoAccount(this.props)}
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
