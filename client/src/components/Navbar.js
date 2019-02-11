import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Web3Account from './Web3Account';
import logo from '../images/wetrust-logo.svg';

const styles = {
  grow: {
    flexGrow: 1,
  },
  brandImage: {
    height: '1.5rem',
  },
};

class Navbar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar>
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
