import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import UnstakeProcessBase from './UnstakeProcessBase';
import { UNSTAKE_PENDING } from '../../actions';
import theme from '../../theme';
import { convertToWholeTRSTForView } from '../../formatter';

class UnstakePending extends React.Component {
  render() {
    const { unstakeProcess } = this.props;
    const { step, activity } = unstakeProcess;
    return (
      <UnstakeProcessBase
        open={step === UNSTAKE_PENDING}
        stepIcon={
          <CircularProgress color="secondary" thickness={8} size={18} />
        }
        stepMessage={`Claiming ${convertToWholeTRSTForView(
          (activity && activity.amount) || 0,
        )} TRST`}
      >
        <Typography style={{ color: theme.palette.text.disabled }}>
          Please confirm MetaMask!
        </Typography>
      </UnstakeProcessBase>
    );
  }
}

const mapStateToProps = (state) => ({
  unstakeProcess: state.unstakeProcess,
});

export default connect(mapStateToProps)(UnstakePending);
