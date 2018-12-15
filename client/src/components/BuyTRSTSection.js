import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Section from './Section';
import SectionHeader from './SectionHeader';

const styles = {
  container: {
    textAlign: 'center',
    margin: 'auto',
  },
};

class BuyTRSTSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMsgShown: false,
    };
    this.handleBuyClick = this.handleBuyClick.bind(this);
  }

  handleBuyClick(e) {
    e.preventDefault();
    clearTimeout(this.timeOut);

    this.setState({
      isMsgShown: true,
    });

    this.timeOut = window.setTimeout(() => this.setState({
      isMsgShown: false,
    }), 1000);
  }

  render() {
    const { color, classes } = this.props;
    const { isMsgShown } = this.state;
    return (
      <Section color={color}>
        <SectionHeader>
          {"Don't have TRST?"}
        </SectionHeader>
        <div className={classes.container}>
          {isMsgShown
            && (
            <Typography
              color="error"
            >
                Hold on! Let us consult with our lawyers.
            </Typography>
            )}
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleBuyClick}
          >
            Buy TRST with your Credit Card
          </Button>
        </div>
      </Section>
    );
  }
}

export default withStyles(styles)(BuyTRSTSection);
