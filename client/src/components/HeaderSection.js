import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Section from './Section';
import SectionHeader from './SectionHeader';

const styles = (theme) => {
  const navHeight = theme.mixins.toolbar.minHeight;
  return {
    container: {
      margin: 'auto',
      marginTop: navHeight,
      maxWidth: theme.breakpoints.values.lg,
    },
  };
};

class HeaderSection extends React.Component {
  render() {
    const { color, classes } = this.props;
    return (
      <Section
        id="header-section"
        color={color}
        className={classes.container}
      >
        <SectionHeader>
          <Typography align="center" color="secondary" variant="h3">Curate the SPRING directory</Typography>
        </SectionHeader>
        <Grid
          container
          direction="row"
          justify="center"
        >
          <Grid item xs={10} sm={10} md={8} lg={4}>
            <Typography variant="h6">
              As a decentralized donation platform,
              SPRING allows TRST token holders to decide which causes are featured,
              and a way to add new causes to the platform.
            </Typography>
            <br />
          </Grid>
          <Grid lg={1} />
          <Grid item xs={10} sm={10} md={8} lg={7}>
            <Typography variant="h6">
              To help a cause become featured, simply stake TRST tokens in their favor.
              The causes with the most staked in their name,
              will be rank highest in the SPRING directory.
              After the lock up period, you can take your tokens back,
              but their rankings will drop accordingly.
            </Typography>
            <br />
            <Typography variant="h6">
              Staking TRST to an organization that is not currently on SPRING
              will let them know how much support there is in the ETH community
              and encourage them to accept ETH as donations.
            </Typography>
          </Grid>
        </Grid>
      </Section>
    );
  }
}

export default withStyles(styles)(HeaderSection);
