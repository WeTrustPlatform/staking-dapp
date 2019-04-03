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
    margin: 'auto',
    textAlign: 'center',
  },
  content: {
    margin: theme.spacing.unit * 2,
  },
  action: {
    margin: theme.spacing.unit * 2,
    marginTop: theme.mixins.toolbar.minHeight,
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
      <Dialog
        open={open}
        onClose={onClose}
        className={classes.root}
        maxWidth="sm"
        fullWidth
      >
        {!!onClose && <CloseIcon onClick={onClose} />}
        <DialogTitle disableTypography>
          <Typography variant="h5">{title}</Typography>
        </DialogTitle>
        <DialogContent>
          <div className={classes.content}>{children}</div>
          <div className={classes.action}>
            {!!action && (
              <Button
                fullWidth
                onClick={onSubmit}
                color="primary"
                variant="contained"
                size="large"
              >
                {action}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(DialogBase);
