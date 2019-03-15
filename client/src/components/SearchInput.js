import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Downshift from 'downshift';
import debounce from 'lodash.debounce';
import axios from 'axios';
import configs from '../configs';

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 2,
  },
  results: {
    marginTop: theme.spacing.unit,
  },
});

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charities: [],
    };

    this.queryOrg = this.queryOrg.bind(this);
  }

  onStateChange() {
    return debounce(({ inputValue }) => {
      if (typeof inputValue !== 'undefined') {
        this.queryOrg(inputValue);
      }
    }, 500);
  }

  queryOrg(search) {
    const einRegex = /^\d{2}-?\d{7}$/;
    // if users are searching by EIN, remove '-' as CMS format has all digits
    // else replace ' ' with & to be url friendly
    const s = einRegex.test(search)
      ? search.replace(/-/g, '')
      : search.replace(/ /g, '&');
    axios
      .get(
        `${configs.CMS_URL}/charities?search=${window.encodeURIComponent(s)}`,
      )
      .then((res) => {
        const charities = res.data.records.map((r) => ({
          name: r.name,
          stakingId: r.staking_id,
          isOnSpring: r.is_on_spring,
          is501c3: r.is_501c3,
          city: r.city,
          state: r.state,
          country: r.country,
        }));
        this.setState({ charities });
      });
  }

  renderSuggestion({ item, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = selectedItem === item;

    return (
      <MenuItem
        {...itemProps}
        key={item.id}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 'bold' : 'normal',
        }}
      >
        {item.name}
      </MenuItem>
    );
  }

  render() {
    const { classes, onSelected } = this.props;
    const { charities } = this.state;
    return (
      <Downshift
        // TODO: onSelected should cancel onStateChange so that
        // it does not do additional query for the selected item
        onChange={onSelected}
        itemToString={(item) => (item ? item.name : '')}
        onStateChange={this.onStateChange()}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          highlightedIndex,
          selectedItem,
        }) => (
          <div className={classes.container}>
            <TextField
              fullWidth
              label="1. Enter non-profit's name"
              type="search"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                ...getInputProps(),
                disableUnderline: true,
              }}
            />
            {isOpen && charities.length > 0 ? (
              <Paper elevation={3} square className={classes.results}>
                {charities.map((item, index) =>
                  this.renderSuggestion({
                    item,
                    index,
                    itemProps: getItemProps({
                      item,
                      index,
                    }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

export default withStyles(styles)(SearchInput);
