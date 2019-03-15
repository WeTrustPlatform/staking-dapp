import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: theme.spacing.unit * 4,
  },
  primary: {
    display: 'flex',
    alignItems: 'center',
  },
  primaryText: {
    marginRight: theme.spacing.unit / 2,
  },
  primaryUnit: {
    display: 'flex',
    // same height as the text
    maxHeight: theme.typography.h5.fontSize,
  },
});

class NumberCard extends React.Component {
  render() {
    const { title, mainNumber, mainUnit, subText, classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography gutterBottom variant="h4">
            {title}
          </Typography>
          <div className={classes.primary}>
            <div className={classes.primaryText}>
              <Typography variant="h5" color="secondary">
                {mainNumber}
              </Typography>
            </div>
            <div className={classes.primaryUnit}>{mainUnit}</div>
          </div>
          {subText && (
            <Typography color="textSecondary" variant="subtitle1">
              {subText}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(NumberCard);
