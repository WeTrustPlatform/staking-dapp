import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import UnstakeProcessBase from './UnstakeProcessBase';
import errorMark from '../../images/error-mark.svg';
import { UNSTAKE_FAILURE } from '../../actions';
import { trst } from '../../formatter';

class UnstakeFailure extends React.Component {
  render() {
    const { unstakeProcess } = this.props;
    const { step, activity } = unstakeProcess;
    return (
      <UnstakeProcessBase
        open={step === UNSTAKE_FAILURE}
        stepIcon={<img src={errorMark} alt="error-mark" />}
        stepMessage={`Claiming ${trst(
          (activity && activity.amount) || 0,
        )} TRST`}
      >
        <Typography color="error">
          Claiming failed. Please try again.
        </Typography>
      </UnstakeProcessBase>
    );
  }
}

const mapStateToProps = (state) => ({
  unstakeProcess: state.unstakeProcess,
});

export default connect(mapStateToProps)(UnstakeFailure);
