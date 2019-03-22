import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import UnstakeProcessBase from './UnstakeProcessBase';
import checkMark from '../../images/check-mark.svg';
import { UNSTAKE_SUCCESS, unstakeExit } from '../../actions';

class UnstakeSuccess extends React.Component {
  render() {
    const { unstakeProcess, onClose } = this.props;
    const { step } = unstakeProcess;
    return (
      <UnstakeProcessBase
        open={step === UNSTAKE_SUCCESS}
        onClose={onClose}
        onSubmit={onClose}
        action="Back to Staking site"
        stepIcon={<img src={checkMark} alt="check-mark" />}
        stepMessage="Claimed 3,300 TRST"
      >
        <Typography color="secondary">
          Please check Your Stakes to view transaction hash,
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
)(UnstakeSuccess);
