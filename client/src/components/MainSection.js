import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Dashboard from './Dashboard';
import Section from './Section';
import StakeNow from './StakeNow';

const styles = (theme) => {
  const navHeight = theme.mixins.toolbar.minHeight;
  return {
    container: {
      [theme.breakpoints.up('lg')]: {
        padding: `${navHeight * 2}px ${navHeight * 4}px`,
      },
    },
  };
};

class MainSection extends React.Component {
  render() {
    const { classes, color } = this.props;
    return (
      <Section
        id="main-section"
        color={color}
        className={classes.container}
      >
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <StakeNow />
          </Grid>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Dashboard />
          </Grid>
        </Grid>
      </Section>
    );
  }
}

export default withStyles(styles)(MainSection);
