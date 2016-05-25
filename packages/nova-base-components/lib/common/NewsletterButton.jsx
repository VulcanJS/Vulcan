import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';

import { Messages } from 'meteor/nova:core';

class NewsletterButton extends Component {
  constructor(props) {
    super(props);
    this.subscriptionAction = this.subscriptionAction.bind(this);
  }

  /**
   * @summary subscribe or unsubcribe
   * @params action: string, name of the method for subscribing or unsubscribing user
   */
  subscriptionAction(action) {
    return () => {
      Actions.call(action, this.props.user, (error, result) => {
        if (error) {
          console.log(error);
          Messages.flash(error.message, "error");
        } else {
          this.props.successCallback(result);
        }
      });
    };
  }

  render() {
    const isSubscribed = Users.getSetting(this.props.user, 'newsletter_subscribeToNewsletter', false);

    return (
      <Button
        className="newsletter-button"
        onClick={this.subscriptionAction(isSubscribed ? "removeUserFromMailChimpList" : "addUserToMailChimpList")}
        bsStyle="primary"
      >
        {isSubscribed ? "Unsubscribe" : this.props.buttonText}
      </Button>
    )
  }
}

NewsletterButton.propTypes = {
  user: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func.isRequired,
  buttonText: React.PropTypes.string
};

module.exports = NewsletterButton;
export default NewsletterButton;