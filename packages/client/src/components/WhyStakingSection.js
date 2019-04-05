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
import UniswapLogo from '../images/uniswap.png';

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
      borderRight: 'none',
      borderLeft: 'none',
    },
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
  },
  rowItem: {
    padding: theme.spacing.unit * 2,
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
              Stake your TRST tokens to increase visibility for your favorite
              Causes. Causes with the most stake assigned to them will receive
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
              You can obtain TRST tokens from the following platforms.
            </Typography>
            <br />
            <div className={classes.row}>
              <div className={classes.rowItem}>
                <a
                  href="https://www.bancor.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={BancorLogo}
                    className={classes.image}
                    alt="bancor"
                    height="54"
                    width="38"
                  />
                </a>
              </div>
              <div className={classes.rowItem}>
                <a
                  href="https://uniswap.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={UniswapLogo}
                    className={classes.image}
                    alt="uniswap"
                    height="42"
                    width="98"
                  />
                </a>
              </div>
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
              Stake TRST tokens to nominate and reserve the top spot for your
              favorite Causes. Nominated Causes that have staked TRST will
              receive preferential placement upon joining the platform.
            </Typography>
          </Grid>
        </Grid>
      </Section>
    );
  }
}

export default withStyles(styles)(WhyStakingSection);
