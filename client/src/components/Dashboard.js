import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import NumberCard from './NumberCard';
import TRSTIcon from './TRSTIcon';

const styles = {
  root: {
    margin: 'auto',
  },
};


class Dashboard extends React.Component {
  render() {
    const {
      classes, currentStakes, averageStakes, averageStakesInUSD, currentStakers,
    } = this.props;
    return (
      <div className={classes.root}>
        <NumberCard
          title="Current Stakes"
          mainNumber={currentStakes}
          mainUnit={<TRSTIcon />}
        />
        <NumberCard
          title="Average stake"
          mainNumber={averageStakes}
          mainUnit={<TRSTIcon />}
          subText={averageStakesInUSD}
        />
        <NumberCard
          title="Current stakers"
          mainNumber={currentStakers}
          mainUnit={<Icon>people</Icon>}
        />
      </div>
    );
  }
}

// TODO fix me
const mapStateToProps = state => ({
  currentStakes: '0' || state.overallStats.currentStakes,
  averageStakes: '0' || state.overallStats.averageStakes,
  averageStakesInUSD: '0' || state.overallStats.averageStakesInUSD,
  currentStakers: '0' || state.overallStats.currentStakers,
});

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));
