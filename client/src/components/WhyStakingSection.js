import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Section from './Section';
import IconIncreaseRank from '../images/icon-increase-rank.svg';
import IconBuyTRST from '../images/icon-buy-trst.svg';
import IconNominate from '../images/icon-nominate.svg';
import BancorLogo from '../images/bancor.png';

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
  midItem: {
    borderRight: `1px solid ${theme.palette.primary.dark}`,
    borderLeft: `1px solid ${theme.palette.primary.dark}`,
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.mixins.toolbar.minHeight,
      marginBottom: theme.mixins.toolbar.minHeight,
    },
  },
});

class WhyStakingSection extends React.Component {
  render() {
    const { classes, color } = this.props;
    return (
      <Section color={color}>
        <Grid container className={classes.container} justify="center">
          <Grid item xs={12} sm={12} md={4} className={classes.gridItem}>
            <div>
              <img src={IconIncreaseRank} alt="increase-your-rank" />
            </div>
            <br />
            <Typography variant="h5">
              Increase your Rank on the SPRING directory
            </Typography>
            <br />
            <Typography variant="h6">
              Stake your Trustcoin to help your favorite Cause more visible on
              SPRING. Causes with the most stake assigned to them will receive
              higher ranking on SPRING.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            className={cx(classes.gridItem, classes.midItem)}
          >
            <div>
              <img src={IconBuyTRST} alt="buy-trst" />
            </div>
            <br />
            <Typography variant="h5">How to get Trustcoin</Typography>
            <br />
            <Typography variant="h6">
              Please visit the following to obtain Trustcoin.
            </Typography>
            <br />
            <div>
              <a
                href="https://www.bancor.network/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={BancorLogo} alt="bancor" />
              </a>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} className={classes.gridItem}>
            <div>
              <img src={IconNominate} alt="nominate" />
            </div>
            <br />
            <Typography variant="h5">Nominate any organization</Typography>
            <br />
            <Typography variant="h6">
              Stake your Trustcoin to nominate and reserve the top spot for your
              favorite Cause. Nominated Causes that have assigned Trustcoins
              will automatically receive preferential placement upon joining.
            </Typography>
          </Grid>
        </Grid>
      </Section>
    );
  }
}

export default withStyles(styles)(WhyStakingSection);
