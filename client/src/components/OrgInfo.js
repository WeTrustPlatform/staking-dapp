import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => {
  const spacing = theme.spacing.unit;
  return {
    root: {
      paddingTop: spacing,
    },
    row: {
      padding: spacing * 2,
    },
    divider: {
      padding: `0px ${spacing * 2}px`,
    },
  };
};

class OrgInfo extends React.Component {
  render501c3Info(data) {
    return (
      <span>
        {`EIN: ${data.stakingId}. Location: ${data.city}, ${data.state}, ${
          data.country
        }`}
      </span>
    );
  }

  render501c3(data) {
    return <Typography>{this.render501c3Info(data)}</Typography>;
  }

  renderSpringCause(data) {
    return (
      <Typography>
        {`${data.name} is on `}
        <a
          href="https://spring.wetrust.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          spring.wetrust.io
        </a>
        <br />
        {data.is501c3 && this.render501c3Info(data)}
        {!data.is501c3 && `Staking ID: ${data.stakingId}`}
      </Typography>
    );
  }

  renderDetails(data) {
    return data.isOnSpring
      ? this.renderSpringCause(data)
      : this.render501c3(data);
  }

  render() {
    const { data, classes } = this.props;
    return (
      <Grid container spacing={12} className={classes.root}>
        <Grid item xs={12} className={classes.row}>
          <Typography variant="h5" color="secondary">
            {data.name}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.divider}>
          <Divider />
        </Grid>
        <Grid item xs={12} className={classes.row}>
          {this.renderDetails(data)}
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(OrgInfo);
