import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  link: {
    color: theme.palette.secondary.main,
  },
});
class GetMoreTRST extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center">
        <Typography variant="h6">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.bancor.network/"
            className={classes.link}
          >
            Get more TRST
          </a>
        </Typography>
      </Grid>
    );
  }
}

export default withStyles(styles)(GetMoreTRST);
