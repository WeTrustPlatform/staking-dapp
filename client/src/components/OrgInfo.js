import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class OrgInfo extends React.Component {
  renderDetails(data) {
    return (
      <div>
        <p>
          {`EIN: ${data.stakingId}`}
        </p>
        <p>
          {`Location: ${data.city}, ${data.state}, ${data.country}`}
        </p>
      </div>
    );
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        <List>
          <ListItem>
            <ListItemText primary={
              this.renderDetails(data)
            }
            />
          </ListItem>
        </List>
      </div>
    );
  }
}

export default OrgInfo;
