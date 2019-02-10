import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import BuyTRSTSection from './BuyTRSTSection';
import ActivitiesSection from './ActivitiesSection';
import HeaderSection from './HeaderSection';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <HeaderSection color="light" />
        <MainSection color="dark" />
        <ActivitiesSection color="dark" />
        <BuyTRSTSection color="light" />
        <FAQSection color="dark" />
        <Footer color="light" />
      </div>
    );
  }
}

export default HomePage;
