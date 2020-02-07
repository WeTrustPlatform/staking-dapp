import React from 'react';
import { WeTrustProductsBanner } from '@wetrustplatform/wetrust-ui/cjs/WeTrustProductsBanner';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Web3Account from './Web3Account';
import logo from '../images/wetrust-logo.svg';

const styles = (theme) => {
  const navHeight = theme.mixins.toolbar.minHeight;
  return {
    grow: {
      flexGrow: 1,
    },
    brandImage: {
      height: '1.5rem',
    },
    universalBar: {
      minHeight: navHeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#222222',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    universalBarItem: {
      margin: 'auto 36px',
      display: 'flex',
      alignItems: 'center',
    },
  };
};

class Navbar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="relative">
          <WeTrustProductsBanner />
          <Toolbar>
            <div className={classes.grow}>
              <img src={logo} alt="WeTrust" className={classes.brandImage} />
            </div>
            <Web3Account />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Navbar);
