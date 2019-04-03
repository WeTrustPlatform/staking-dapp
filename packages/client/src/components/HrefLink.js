import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  link: {
    color: theme.palette.secondary.main,
  },
});

class HrefLink extends React.Component {
  render() {
    const { href, children, classes } = this.props;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        className={classes.link}
      >
        {children}
      </a>
    );
  }
}

export default withStyles(styles)(HrefLink);
