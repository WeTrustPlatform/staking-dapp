import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const styles = (theme) => ({
  copyright: {
    fontSize: 14,
  },
  link: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  container: {
    paddingTop: 40,
    paddingBottom: 40,
    textAlign: 'center',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  facebook: {
    color: '#3291e9',
    fontWeight: 'bold',
  },
  twitter: {
    color: '#00c6ff',
    fontWeight: 'bold',
  },
  blog: {
    color: '#00d383',
    fontWeight: 'bold',
  },
});

export const Footer = (props) => {
  const { classes } = props;
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} WeTrustPlatform - All rights reserved`;

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Typography
          component="a"
          className={classes.link}
          href="https://spring.wetrust.io"
        >
          Home
        </Typography>
        <Typography
          component="a"
          className={classes.link}
          href="https://spring.wetrust.io/causes"
        >
          Causes
        </Typography>
        <Typography
          component="a"
          className={classes.link}
          href="https://www.wetrust.io"
        >
          About us
        </Typography>
        <Typography
          component="a"
          className={classes.link}
          href="/_Crypto_Unlocked_Terms_and_Conditions_v1.2.pdf"
        >
          Terms and Conditions
        </Typography>
        <Typography
          className={classes.link}
          href="https://github.com/WeTrustPlatform/documents/blob/master/FinclusionLabs_PrivacyPolicy_October92018_GDPRCompliant.pdf"
        >
          Privacy Policy
        </Typography>
      </div>
      <div className={classes.wrapper}>
        <Typography
          component="a"
          className={`${classes.link} ${classes.facebook}`}
          href="https://www.facebook.com/wetrustplatform"
        >
          Facebook
        </Typography>
        <Typography
          component="a"
          className={`${classes.link} ${classes.twitter}`}
          href="https://twitter.com/wetrustplatform"
        >
          Twitter
        </Typography>
        <Typography
          component="a"
          className={`${classes.link} ${classes.blog}`}
          href="https://blog.wetrust.io/"
        >
          Blog
        </Typography>
      </div>
      <div className={classes.wrapper}>
        <Typography className={classes.copyright}>{copyrightText}</Typography>
      </div>
    </div>
  );
};

export default withStyles(styles)(Footer);
