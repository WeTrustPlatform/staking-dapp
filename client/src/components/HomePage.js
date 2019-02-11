import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import ActivitiesSection from './ActivitiesSection';
import TopSection from './TopSection';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <TopSection color="light" />
        <MainSection color="dark" />
        <ActivitiesSection color="light" />
        <FAQSection color="dark" />
        <Footer color="light" />
      </div>
    );
  }
}

export default HomePage;
