import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 4,
  },
  primaryText: {
    display: 'table',
  },
  span: {
    display: 'table-cell',
    verticalAlign: 'middle',
    paddingRight: theme.spacing.unit / 2,
  },
});

class NumberCard extends React.Component {
  render() {
    const {
      title, mainNumber, mainUnit, subText, classes,
    } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography gutterBottom color="secondary" variant="h6">
            {title}
          </Typography>
          <Typography variant="h5" className={classes.primaryText}>
            <span className={classes.span}>
              {mainNumber}
            </span>
            <span className={classes.span}>
              {mainUnit}
            </span>
          </Typography>
          {
          subText
          && (
          <Typography color="textSecondary" variant="subtitle1">
            {subText}
          </Typography>
          )
          }
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(NumberCard);
