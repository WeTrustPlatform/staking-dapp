import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import eth from '../images/eth-icon.svg';
import { trst, networkName } from '../formatter';
import { validateNetworkId } from '../utils';

const styles = (theme) => ({
  warning: {
    backgroundColor: '#F6A623',
  },
  error: {
    backgroundColor: '#F6A623',
  },
  accountText: {
    color: theme.palette.text.primary,
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
    const { account, networkId, trstBalance, classes } = props;
    const network = validateNetworkId(networkId) || networkName(networkId);

    const getSecondaryText = () => (
      <div>
        <span className={classes.accountText}>{account}</span>
        <br />
        {`Network: ${network} - TRST: ${trst(trstBalance)}`}
      </div>
    );

    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar src={eth} />
        </ListItemAvatar>
        <ListItemText secondary={getSecondaryText()} />
      </ListItem>
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
