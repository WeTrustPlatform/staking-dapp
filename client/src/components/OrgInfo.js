import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class OrgInfo extends React.Component {
  render501c3Info(data) {
    return (
      <span>
        {`EIN: ${data.stakingId}`}
        <br />
        {`Location: ${data.city}, ${data.state}, ${data.country}`}
      </span>
    );
  }

  render501c3(data) {
    return <p>{this.render501c3Info(data)}</p>;
  }

  renderSpringCause(data) {
    return (
      <p>
        {`${data.name} is on `}
        <a
          href="https://spring.wetrust.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          spring.wetrust.io
        </a>
        <br />
        {data.is501c3 && this.render501c3Info(data)}
        {!data.is501c3 && `Staking ID: ${data.stakingId}`}
      </p>
    );
  }

  renderDetails(data) {
    return data.isOnSpring
      ? this.renderSpringCause(data)
      : this.render501c3(data);
  }

  render() {
    const { data } = this.props;
    return (
      <List>
        <ListItem>
          <ListItemText primary={this.renderDetails(data)} />
        </ListItem>
      </List>
    );
  }
}

export default OrgInfo;
