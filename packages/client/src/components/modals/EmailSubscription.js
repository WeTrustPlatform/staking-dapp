import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import jsonp from 'jsonp';
import HrefLink from '../HrefLink';
import DialogBase from './DialogBase';

const styles = (theme) => ({
  subtitle: {
    marginBottom: theme.typography.h5.lineHeight,
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
      email: '',
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
    const { email } = this.state;
    jsonp(
      `https://wetrust.us14.list-manage.com/subscribe/post-json?u=118cc8927f2584d76237cb8b9&amp;id=19f2388189&EMAIL=${email}`,
      { param: 'c' },
      (err, data) => {
        if (err) {
          // not able to reach here
          console.log(err);
        }

        if (data && data.result === 'error') {
          this.setState({
            errorMessage: data && data.msg,
          });
          return;
        }

        onClose();
      },
    );
  }

  render() {
    const { open, onClose, classes } = this.props;
    const { errorMessage, email } = this.state;
    return (
      <DialogBase
        open={open}
        onClose={onClose}
        title="Sign up to receive updates of your favorite Cause"
        onSubmit={this.onValidate}
        action="Subscribe"
      >
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
        <div>
          <Typography
            color="error"
            dangerouslySetInnerHTML={{ __html: errorMessage }}
          />
        </div>
      </DialogBase>
    );
  }
}

export default withStyles(styles)(EmailSubscription);
