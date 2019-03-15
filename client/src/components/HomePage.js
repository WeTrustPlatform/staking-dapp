import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import ActivitiesSection from './ActivitiesSection';
import TopSection from './TopSection';
import WhyStakingSection from './WhyStakingSection';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <TopSection color="light" />
        <WhyStakingSection color="dark" />
        <MainSection color="light" />
        <ActivitiesSection color="dark" />
        <FAQSection color="light" />
        <Footer color="light" />
      </div>
    );
  }
}

export default HomePage;
