import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    textAlign: 'left',
    padding: theme.spacing.unit * 2,
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  gridIcon: {
    textAlign: 'right',
  },
  question: {
    cursor: 'pointer',
  },
  answer: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class FAQItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnswerShown: false,
    };
    this.toggleAnswer = this.toggleAnswer.bind(this);
  }

  toggleAnswer() {
    this.setState(prevState => ({
      isAnswerShown: !prevState.isAnswerShown,
    }));
  }

  render() {
    const { classes, question, answer } = this.props;
    const { isAnswerShown } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.question} onClick={this.toggleAnswer} role="presentation">
          <Grid container>
            <Grid item xs={10}>
              <Typography variant="h6">
                {question}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.gridIcon}>
              <Icon>{isAnswerShown ? 'remove' : 'add'}</Icon>
            </Grid>
          </Grid>
        </div>
        <br />
        { isAnswerShown
        && (
        <div className={classes.answer}>
          <Typography variant="subtitle1">
            {answer}
          </Typography>
        </div>
        )
        }
        <Divider className={classes.divider} />
      </div>
    );
  }
}

export default withStyles(styles)(FAQItem);
