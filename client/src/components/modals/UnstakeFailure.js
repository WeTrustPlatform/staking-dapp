import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import UnstakeProcessBase from './UnstakeProcessBase';
import errorMark from '../../images/error-mark.svg';
import { UNSTAKE_FAILURE, unstakeExit } from '../../actions';

class UnstakeFailure extends React.Component {
  render() {
    const { unstakeProcess, onClose } = this.props;
    const { step } = unstakeProcess;
    return (
      <UnstakeProcessBase
        open={step === UNSTAKE_FAILURE}
        onClose={onClose}
        onSubmit={onClose}
        action="Back to Staking site"
        stepIcon={<img src={errorMark} alt="error-mark" />}
        stepMessage="Claiming 3,300 TRST"
      >
        <Typography color="error">
          Claiming failed. Please try again.
        </Typography>
      </UnstakeProcessBase>
    );
  }
}

const mapStateToProps = (state) => ({
  unstakeProcess: state.unstakeProcess || {},
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(unstakeExit()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnstakeFailure);
