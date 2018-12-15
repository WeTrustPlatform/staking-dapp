import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

class StakeAmountInput extends React.Component {
  render() {
    const { amount, onChange } = this.props;
    return (
      <div>
        <TextField
          fullWidth
          label="Enter an amount"
          onChange={onChange}
          value={amount}
          type="number"
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">TRST</InputAdornment>,
          }}
        />
      </div>
    );
  }
}

export default StakeAmountInput;
