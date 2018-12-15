import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Section from './Section';
import SectionHeader from './SectionHeader';
import FAQItem from './FAQItem';
import faq from './faq.json';

const styles = theme => ({
  container: {
    margin: 'auto',
    maxWidth: theme.breakpoints.values.md,
  },
});

class FAQSection extends React.Component {
  renderFAQItems() {
    return faq.map(item => (
      <FAQItem
        key={item.question}
        question={item.question}
        answer={item.answer}
      />
    ));
  }

  render() {
    const { classes, color } = this.props;
    return (
      <Section id="faq-section" color={color}>
        <SectionHeader>FAQ</SectionHeader>
        <div className={classes.container}>
          {this.renderFAQItems()}
        </div>
      </Section>
    );
  }
}

export default withStyles(styles)(FAQSection);
