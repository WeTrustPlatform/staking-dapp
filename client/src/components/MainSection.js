import React from 'react';
import Section from './Section';
import SectionHeader from './SectionHeader';
import StakeNow from './StakeNow';
import GetMoreTRST from './GetMoreTRST';

class MainSection extends React.Component {
  render() {
    const { color } = this.props;
    return (
      <Section id="main-section" color={color}>
        <SectionHeader>Start staking</SectionHeader>
        <StakeNow />
        <GetMoreTRST />
      </Section>
    );
  }
}

export default MainSection;
