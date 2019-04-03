import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import YourStakesSection from './YourStakesSection';
import TopSection from './TopSection';
import RankingSection from './RankingSection';
import WhyStakingSection from './WhyStakingSection';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <TopSection color="light" />
        <WhyStakingSection color="dark" />
        <MainSection color="light" />
        <YourStakesSection color="dark" />
        <RankingSection color="light" />
        <FAQSection color="dark" />
        <Footer color="light" />
      </div>
    );
  }
}

export default HomePage;
