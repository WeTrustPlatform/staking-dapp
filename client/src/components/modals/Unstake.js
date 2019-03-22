import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import UnstakeWarning from './UnstakeWarning';
import UnstakeProcessBase from './UnstakeProcessBase';
import checkMark from '../../images/check-mark.svg';
import errorMark from '../../images/error-mark.svg';

const STEP_WARNING = 'warning';
const STEP_PENDING = 'pending';
const STEP_SUCCESS = 'success';
const STEP_FAILURE = 'failure';

const styles = () => ({});

class Unstake extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: STEP_WARNING,
    };

    this.renderWarning = this.renderWarning.bind(this);
    this.renderPending = this.renderPending.bind(this);
    this.renderSuccess = this.renderSuccess.bind(this);
    this.renderFailure = this.renderFailure.bind(this);
  }

  renderText(t, color) {
    return <Typography color={color}>{t}</Typography>;
  }

  renderWarning() {
    const { open, onClose } = this.props;
    return <UnstakeWarning open={open} onClose={onClose} />;
  }

  renderPending() {
    const { open, onClose } = this.props;
    return (
      <UnstakeProcessBase
        open={open}
        onClose={onClose}
        stepIcon={
          <CircularProgress color="secondary" thickness={8} size={18} />
        }
        stepMessage={this.renderText('Claiming 3,300 TRST')}
        result={this.renderText('Please confirm MetaMask!', 'disabled')}
      />
    );
  }

  renderSuccess() {
    const { open, onClose } = this.props;
    return (
      <UnstakeProcessBase
        open={open}
        onClose={onClose}
        stepIcon={<img src={checkMark} alt="check-mark" />}
        stepMessage={this.renderText('Claimed 3,300 TRST')}
        result={this.renderText(
          'Please check Your Stakes to view transaction hash',
          'secondary',
        )}
      />
    );
  }

  renderFailure() {
    const { open, onClose } = this.props;
    return (
      <UnstakeProcessBase
        open={open}
        onClose={onClose}
        stepIcon={<img src={errorMark} alt="error-mark" />}
        stepMessage={this.renderText('Claiming 3,300 TRST')}
        result={this.renderText(
          'Please check Your Stakes to view transaction hash',
          'error',
        )}
      />
    );
  }

  render() {
    const { step } = this.state;
    return (
      <div>
        {step === STEP_WARNING && this.renderWarning()}
        {step === STEP_PENDING && this.renderPending()}
        {step === STEP_SUCCESS && this.renderSuccess()}
        {step === STEP_FAILURE && this.renderFailure()}
      </div>
    );
  }
}

export default withStyles(styles)(Unstake);
