import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import { withMutation, withCurrentUser, withMessages } from 'meteor/nova:core';

class NewsletterButton extends Component {
  constructor(props) {
    super(props);
    this.subscriptionAction = this.subscriptionAction.bind(this);

    const isSubscribed = props.currentUser.__newsletter_subscribeToNewsletter;

    this.state = {
      labelId: isSubscribed ? 'newsletter.unsubscribe' : 'newsletter.subscribe',
      action: isSubscribed ? 'removeUserNewsletter' : 'addUserNewsletter'
    };
  }
  
  subscriptionAction() {

    const action = this.state.action;

    this.props[action]({userId: this.props.currentUser._id}).then(result => {
      console.log(result)
      this.props.successCallback(result);
      if (result.data[action].action === 'subscribed') {
        this.setState({
          labelId: 'newsletter.unsubscribe',
          action: 'removeUserNewsletter',
        });
      } else {
        this.setState({
          labelId: 'newsletter.subscribe',
          action: 'addUserNewsletter',
        });
      }
    }).catch(error => {
      console.log(error);
      this.props.flash(error.message, "error");
    });
  }

  render() {

    return (
      <Button
        className="newsletter-button"
        onClick={this.subscriptionAction}
        bsStyle="primary"
      >
        <FormattedMessage id={this.state.labelId}/>
      </Button>
    )
  }
}

NewsletterButton.propTypes = {
  successCallback: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
};

NewsletterButton.contextTypes = {
  actions: React.PropTypes.object,
};

const addOptions = {name: 'addUserNewsletter', args: {userId: 'String'}};
const removeOptions = {name: 'removeUserNewsletter', args: {userId: 'String'}};

registerComponent('NewsletterButton', NewsletterButton, withCurrentUser, withMutation(addOptions), withMutation(removeOptions), withMessages);