import React from 'react';
import Typography from '@material-ui/core/Typography';
import DialogBase from './DialogBase';

class UnstakeWarning extends React.Component {
  render() {
    const { open, onClose } = this.props;
    return (
      <DialogBase
        open={open}
        onClose={onClose}
        title="The current rank of your favorite Cause will drop"
        onSubmit={() => {}}
        action="Continue"
      >
        <Typography>
          By claiming back 3,000 TRST, Lava Mae rank will drop to 23.
        </Typography>
      </DialogBase>
    );
  }
}

export default UnstakeWarning;
