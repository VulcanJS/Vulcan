import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { Messages } from 'meteor/nova:core';

class NewsletterButton extends Component {
  constructor(props) {
    super(props);
    this.subscriptionAction = this.subscriptionAction.bind(this);
  }
  
  subscriptionAction() {
    const action = Users.getSetting(this.context.currentUser, 'newsletter_subscribeToNewsletter', false) ? 
      'newsletter.removeUser' : 'newsletter.addUser';

    Meteor.call(action, this.context.currentUser, (error, result) => {
      if (error) {
        console.log(error);
        Messages.flash(error.message, "error");
      } else {
        this.props.successCallback(result);
      }
    });
  }

  render() {
    const isSubscribed = Users.getSetting(this.context.currentUser, 'newsletter_subscribeToNewsletter', false);

    return (
      <Button
        className="newsletter-button"
        onClick={this.subscriptionAction}
        bsStyle="primary"
      >
        {isSubscribed ? this.props.unsubscribeText : this.props.subscribeText}
      </Button>
    )
  }
}

NewsletterButton.propTypes = {
  successCallback: React.PropTypes.func.isRequired,
  subscribeText: React.PropTypes.string,
  unsubscribeText: React.PropTypes.string
};

NewsletterButton.defaultProps = {
  subscribeText: "Subscribe",
  unsubscribeText: "Unsubscribe"
};

NewsletterButton.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = NewsletterButton;
export default NewsletterButton;