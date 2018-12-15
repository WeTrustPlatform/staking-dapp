import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  item: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  href: {
    color: theme.palette.secondary.main,
  },
  fab: {
    fontSize: '3em',
  },
});

class SocialMedia extends React.Component {
  constructor(props) {
    super(props);
    this.renderSocialItem = this.renderSocialItem.bind(this);
  }

  renderSocialItem(faName, href) {
    const { classes } = this.props;
    return (
      <Grid item className={classes.item}>
        <a
          className={classes.href}
          target="_blank"
          rel="noopener noreferrer"
          href={href}
        >
          <Icon
            className={classnames(classes.fab, `fab fa-${faName}`)}
          />
        </a>
      </Grid>
    );
  }

  render() {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
      >
        {this.renderSocialItem('facebook', 'https://www.facebook.com/wetrustplatform')}
        {this.renderSocialItem('reddit', 'https://www.reddit.com/r/WeTrustPlatform')}
        {this.renderSocialItem('twitter', 'https://twitter.com/wetrustplatform')}
        {this.renderSocialItem('github', 'https://github.com/wetrustplatform')}
        {this.renderSocialItem('medium', 'https://medium.com/wetrust-blog')}
      </Grid>
    );
  }
}

export default withStyles(styles)(SocialMedia);
