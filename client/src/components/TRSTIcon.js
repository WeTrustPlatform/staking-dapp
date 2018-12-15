import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import trst from '../images/trst.png';

const styles = theme => ({
  icon: {
    maxWidth: theme.typography.h5.fontSize,
  },
});

class TRSTIcon extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <img src={trst} alt="TRST" className={classes.icon} />
    );
  }
}

export default withStyles(styles)(TRSTIcon);
