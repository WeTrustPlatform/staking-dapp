import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Section from './Section';
import SectionHeader from './SectionHeader';

const styles = (theme) => {
  const navHeight = theme.mixins.toolbar.minHeight;
  return {
    root: {
      marginTop: navHeight * 1.5,
    },
    container: {
      margin: 'auto',
      maxWidth: theme.breakpoints.values.md,
    },
  };
};

class TopSection extends React.Component {
  render() {
    const { color, classes } = this.props;
    return (
      <Section id="top-section" color={color} className={classes.root}>
        <SectionHeader>Help curate the SPRING directory</SectionHeader>
        <Grid
          container
          direction="row"
          justify="center"
          className={classes.container}
        >
          <Typography variant="h6" align="center">
            As a decentralized fundraising platform, TRST token holders decide
            which causes should be highly ranked, and nominate new causes to
            join the platform
          </Typography>
        </Grid>
      </Section>
    );
  }
}

export default withStyles(styles)(TopSection);
