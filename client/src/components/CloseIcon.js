import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  left: {
    flexGrow: 1,
  },
  right: {
    '&:hover': {
      cursor: 'pointer',
    },
    margin: 8,
    width: 16,
    height: 16,
    backgroundColor: theme.palette.primary.dark,
    borderRadius: '50%',
  },
  x: {
    marginTop: -5,
    color: theme.palette.primary.light,
  },
});

class CloseIcon extends React.Component {
  render() {
    const { classes, onClick } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.left} />
        <div className={classes.right}>
          <Typography component="a" onClick={onClick} className={classes.x}>
            x
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CloseIcon);
