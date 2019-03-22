import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from './CloseIcon';

const styles = (theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    margin: 'auto',
    textAlign: 'center',
  },
});

class DialogBase extends React.Component {
  render() {
    const {
      title,
      open,
      onClose,
      children,
      onSubmit,
      action,
      classes,
    } = this.props;
    return (
      <Dialog open={open} onClose={onClose} className={classes.root}>
        <CloseIcon onClick={onClose} />
        <DialogTitle>
          <Typography variant="h5">{title}</Typography>
        </DialogTitle>
        <DialogContent>
          {children}
          <Button
            fullWidth
            onClick={onSubmit}
            color="primary"
            variant="contained"
            size="large"
          >
            {action}
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogBase);
