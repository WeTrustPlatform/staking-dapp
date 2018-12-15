import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    marginBottom: theme.mixins.toolbar.minHeight,
  },
});

class SectionHeader extends React.Component {
  render() {
    const { children, classes } = this.props;
    return (
      <Typography className={classes.container} color="secondary" variant="h3" align="center">{children}</Typography>
    );
  }
}

export default withStyles(styles)(SectionHeader);
