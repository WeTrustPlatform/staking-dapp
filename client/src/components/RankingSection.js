import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Section from './Section';
import LeaderBoard from './LeaderBoard';

const styles = (theme) => ({
  container: {
    width: 'auto',
    margin: 'auto',
    maxWidth: theme.breakpoints.values.lg,
  },
  gridItem: {
    textAlign: 'center',
    paddingLeft: theme.spacing.unit * 6,
    paddingRight: theme.spacing.unit * 6,
  },
  bottomItem: {
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.mixins.toolbar.minHeight,
    },
  },
});

class RankingSection extends React.Component {
  render() {
    const { causesStats, classes, color } = this.props;
    return (
      <Section color={color}>
        <Grid container className={classes.container} justify="center">
          <Grid item xs={12} sm={12} md={6} className={classes.gridItem}>
            <LeaderBoard
              title="Most staked Causes"
              subtitle="The following causes have been granted higher ranking by Trustcoin holders."
              causesStats={causesStats}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            className={cx(classes.gridItem, classes.bottomItem)}
          >
            <LeaderBoard
              title="Nominated Causes"
              subtitle="The following causes have been nominated by Trustcoin holders."
              causesStats={causesStats}
            />
          </Grid>
        </Grid>
      </Section>
    );
  }
}

const mapStateToProps = (state) => ({
  causesStats: state.causesStats,
});

export default connect(mapStateToProps)(withStyles(styles)(RankingSection));
