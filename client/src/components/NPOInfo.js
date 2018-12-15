import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class NPOInfo extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <div style={{ visibility: data.name ? 'visible' : 'hidden' }}>
        <List>
          <ListItem>
            <ListItemText primary={
              `EIN: ${data.ein}.
              Location: ${data.city}, ${data.state}, ${data.country}`
            }
            />
          </ListItem>
        </List>
      </div>
    );
  }
}

export default NPOInfo;
