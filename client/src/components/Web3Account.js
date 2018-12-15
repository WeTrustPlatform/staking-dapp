import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import eth from '../images/eth-icon.png';

const styles = {
  warning: {
    backgroundColor: '#F6A623',
  },
  error: {
    backgroundColor: '#F6A623',
  },
};


class Web3Account extends React.Component {
  renderNoWeb3(props) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar className={props.classes.error}>
            <Icon>error_outlined</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Please install MetaMask"
        />
      </ListItem>
    );
  }

  renderNoAccount(props) {
    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar className={props.classes.warning}>
            <Icon>warning</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Please log in MetaMask" />
      </ListItem>
    );
  }

  renderAccount(props) {
    const { account, networkId, trstBalance } = props;

    const env = EmbarkJS.environment;
    let errorMessage = '';
    if (env === 'livenet' && networkId !== '1') {
      errorMessage = '- Please switch to Mainnet.';
    } else if (env === 'testnet' && networkId !== '4') {
      errorMessage = '- Please switch to Rinkeby.';
    }

    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar src={eth} />
        </ListItemAvatar>
        <ListItemText
          primary={account}
          secondary={`Network: ${networkId} - TRST: ${trstBalance} ${errorMessage}`}
        />
      </ListItem>
    );
  }

  render() {
    const { hasWeb3, account } = this.props;
    return (
      <List>
        {!hasWeb3 && this.renderNoWeb3(this.props)}
        {hasWeb3 && !account && this.renderNoAccount(this.props)}
        {hasWeb3 && account && this.renderAccount(this.props)}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  networkId: state.networkId,
  hasWeb3: state.hasWeb3,
  trstBalance: state.trstBalance,
});

export default connect(mapStateToProps)(withStyles(styles)(Web3Account));
