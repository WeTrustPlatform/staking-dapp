import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const durations = [
  {
    value: 30,
    label: '30 days',
  },
  {
    value: 180,
    label: '180 days',
  },
  {
    value: 365,
    label: '365 days',
  },
];

class StakeDurationInput extends React.Component {
  render() {
    const { duration, onChange } = this.props;
    return (
      <div>
        <TextField
          fullWidth
          select
          value={duration}
          onChange={onChange}
          label="Select a lock-up duration"
          margin="normal"
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">Duration</InputAdornment>,
          }}
        >
          {
            durations.map(options => (
              <option
                key={options.value}
                value={options.value}
              >
                {options.label}
              </option>
            ))
          }
        </TextField>
      </div>
    );
  }
}

export default StakeDurationInput;
