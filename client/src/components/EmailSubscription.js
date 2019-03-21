import React from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import HrefLink from './HrefLink';
import CloseIcon from './CloseIcon';

const styles = (theme) => ({
  root: {
    maxWidth: theme.breakpoints.values.sm,
    margin: 'auto',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: theme.typography.h5.lineHeight,
  },
  errorMessage: {
    margin: theme.spacing.unit * 2,
    minHeight: theme.spacing.unit * 3,
  },
});

const isValidEmail = (email) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

class EmailSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      email: null,
    };
    this.onSubscribe = this.onSubscribe.bind(this);
    this.onValidate = this.onValidate.bind(this);
  }

  onValidate() {
    const { email } = this.state;
    const isValid = isValidEmail(email);
    if (!isValid) {
      this.setState({
        errorMessage: 'Invalid email. Please try again!',
      });
      return;
    }

    this.onSubscribe();
  }

  onSubscribe() {
    this.setState({
      errorMessage: null,
    });
    const { onClose } = this.props;
    onClose();
  }

  render() {
    const { open, onClose, classes } = this.props;
    const { errorMessage, email } = this.state;
    return (
      <Dialog open={open} onClose={onClose} className={classes.root}>
        <CloseIcon onClick={onClose} />
        <DialogTitle>
          <Typography variant="h5">
            Sign up to receive updates of your favorite Cause
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography className={classes.subtitle}>
            We will send you an email to inform when your nominated Cause is
            available on
            <HrefLink href="https://spring.wetrust.io"> SPRING.</HrefLink>
          </Typography>
          <TextField
            autoFocus
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(event) =>
              this.setState({
                email: event.target.value,
              })
            }
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              disableUnderline: true,
            }}
          />
          <div className={cx(classes.errorMessage, { hidden: !errorMessage })}>
            <Typography color="error">{errorMessage}</Typography>
          </div>
          <Button
            className={classes.subscribe}
            fullWidth
            onClick={this.onValidate}
            color="primary"
            variant="contained"
            size="large"
          >
            Subscribe
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EmailSubscription);
