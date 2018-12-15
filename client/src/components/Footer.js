import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Section from './Section';
import SocialMedia from './SocialMedia';

const styles = theme => ({
  copyright: {
    minHeight: theme.mixins.toolbar.minHeight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Footer extends React.Component {
  render() {
    const { classes, color } = this.props;
    return (
      <Section
        color={color}
      >
        <SocialMedia />
        <div className={classes.copyright}>
          <Typography>© 2018 WeTrustPlatform. All rights reserved.</Typography>
        </div>
      </Section>
    );
  }
}

export default withStyles(styles)(Footer);
