import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Web3Account from './Web3Account';
import HrefLink from './HrefLink';
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
          <div className={classes.universalBar}>
            <HrefLink
              className={classes.universalBarItem}
              href="https://wetrust.io"
            >
              <img
                alt="WeTrust"
                src="https://d1pzjb43ehhiia.cloudfront.net/logo-images/wetrust-global-logo.svg"
              />
            </HrefLink>
            <HrefLink
              className={classes.universalBarItem}
              href="https://spring.wetrust.io"
            >
              <img
                alt="Spring"
                src="https://d1pzjb43ehhiia.cloudfront.net/logo-images/spring-global-logo.svg"
              />
            </HrefLink>
            <HrefLink
              className={classes.universalBarItem}
              href="https://staking.wetrust.io"
            >
              <img
                alt="Staking"
                src="https://d1pzjb43ehhiia.cloudfront.net/logo-images/staking-global-logo.svg"
              />
            </HrefLink>
            <HrefLink
              className={classes.universalBarItem}
              href="https://tlc.wetrust.io"
            >
              <img
                alt="TLC"
                src="https://d1pzjb43ehhiia.cloudfront.net/logo-images/trusted-lending-circles-global-logo.svg"
              />
            </HrefLink>
            <HrefLink
              className={classes.universalBarItem}
              href="https://cryptounlocked.wetrust.io"
            >
              <img
                alt="CryptoUnlocked"
                src="https://d1pzjb43ehhiia.cloudfront.net/logo-images/crypto-unlocked-global-logo.svg"
              />
            </HrefLink>
          </div>
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
