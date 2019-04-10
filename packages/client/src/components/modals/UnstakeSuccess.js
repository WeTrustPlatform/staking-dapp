import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import UnstakeProcessBase from './UnstakeProcessBase';
import checkMark from '../../images/check-mark.svg';
import { UNSTAKE_SUCCESS } from '../../actions';
import { convertToWholeTRSTForView } from '../../formatter';

class UnstakeSuccess extends React.Component {
  render() {
    const { unstakeProcess } = this.props;
    const { step, activity } = unstakeProcess;
    return (
      <UnstakeProcessBase
        open={step === UNSTAKE_SUCCESS}
        stepIcon={<img src={checkMark} alt="check-mark" />}
        stepMessage={`Claiming ${convertToWholeTRSTForView(
          (activity && activity.amount) || 0,
        )} TRST`}
      >
        <Typography color="secondary">
          Please check Your Stakes to view transaction hash.
        </Typography>
      </UnstakeProcessBase>
    );
  }
}

const mapStateToProps = (state) => ({
  unstakeProcess: state.unstakeProcess,
});

export default connect(mapStateToProps)(UnstakeSuccess);
