import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';

const styles = (theme) => ({
  link: {
    color: theme.palette.secondary.main,
  },
});

class HrefLink extends React.Component {
  render() {
    const { href, children, classes, className } = this.props;
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={href}
        className={cx(classes.link, className)}
      >
        {children}
      </a>
    );
  }
}

export default withStyles(styles)(HrefLink);
