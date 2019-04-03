import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import HrefLink from './HrefLink';

class GetMoreTRST extends React.Component {
  render() {
    return (
      <Grid container justify="center">
        <Typography variant="h6">
          <HrefLink href="https://www.bancor.network/">Get more TRST</HrefLink>
        </Typography>
      </Grid>
    );
  }
}

export default GetMoreTRST;
