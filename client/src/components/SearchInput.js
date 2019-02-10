import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Downshift from 'downshift';
import debounce from 'lodash.debounce';
import axios from 'axios';
import configs from '../configs';


const styles = theme => ({
  root: {
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

    this.queryNpo = this.queryNpo.bind(this);
  }

  onStateChange() {
    return debounce(({ inputValue }) => {
      if (typeof inputValue !== 'undefined') {
        this.queryNpo(inputValue);
      }
    }, 500);
  }

  queryNpo(search) {
    axios.get(
      `${configs.CMS_URL}/charities?search=${window.encodeURIComponent(search.replace(/ /g, '&'))}`,
    ).then((res) => {
      const charities = res.data.records;
      this.setState({ charities });
    });
  }

  renderSuggestion({
    item, index, itemProps, highlightedIndex, selectedItem,
  }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = selectedItem === item;

    return (
      <MenuItem
        {...itemProps}
        key={item.name}
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
        itemToString={item => (item ? item.name : '')}
        onStateChange={this.onStateChange()}
      >
        {
          ({
            getInputProps,
            getItemProps,
            isOpen,
            highlightedIndex,
            selectedItem,
          }) => (
            <div className={classes.root}>
              <TextField
                fullWidth
                label="1. Enter your favorite non-profit's name"
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
              {isOpen ? (
                <Paper square className={classes.results}>
                  {
                    charities
                      .map((item, index) => this.renderSuggestion({
                        item,
                        index,
                        itemProps: getItemProps({
                          item,
                          index,
                        }),
                        highlightedIndex,
                        selectedItem,
                      }))
                  }
                </Paper>
              ) : null}
            </div>
          )
        }
      </Downshift>
    );
  }
}

export default withStyles(styles)(SearchInput);
