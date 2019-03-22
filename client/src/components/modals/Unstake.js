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
    const { onClose } = this.props;
    const { step } = this.state;
    return (
      <UnstakeWarning
        open={step === STEP_WARNING}
        onClose={onClose}
        onSubmit={() =>
          this.setState({
            step: STEP_PENDING,
          })
        }
      />
    );
  }

  renderPending() {
    const { onClose } = this.props;
    const { step } = this.state;
    return (
      <UnstakeProcessBase
        open={step === STEP_PENDING}
        onClose={onClose}
        onSubmit={onClose}
        stepIcon={
          <CircularProgress color="secondary" thickness={8} size={18} />
        }
        stepMessage={this.renderText('Claiming 3,300 TRST')}
        result={this.renderText('Please confirm MetaMask!', 'disabled')}
      />
    );
  }

  renderSuccess() {
    const { onClose } = this.props;
    const { step } = this.state;
    return (
      <UnstakeProcessBase
        open={step === STEP_SUCCESS}
        onClose={onClose}
        onSubmit={onClose}
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
    const { onClose } = this.props;
    const { step } = this.state;
    return (
      <UnstakeProcessBase
        open={step === STEP_FAILURE}
        onClose={onClose}
        onSubmit={onClose}
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
    const { open } = this.props;
    const { step } = this.state;
    return (
      <div>
        {open && step === STEP_WARNING && this.renderWarning()}
        {open && step === STEP_PENDING && this.renderPending()}
        {open && step === STEP_SUCCESS && this.renderSuccess()}
        {open && step === STEP_FAILURE && this.renderFailure()}
      </div>
    );
  }
}

export default withStyles(styles)(Unstake);
