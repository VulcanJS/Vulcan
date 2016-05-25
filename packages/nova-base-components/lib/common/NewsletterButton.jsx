import React, { PropTypes, Component } from 'react';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';

import { Messages } from 'meteor/nova:core';

class NewsletterButton extends Component {
  constructor(props) {
    super(props);
    this.subscribeUser = this.subscribeUser.bind(this);
    this.unsubscribeUser = this.unsubscribeUser.bind(this);
  }

  subscribeUser() {
    Actions.call("addUserToMailChimpList", this.props.user, (error, result) => this.props.callback(error, result));
  }

  unsubscribeUser() {
    Actions.call("removeUserFromMailChimpList", this.props.user, (error, result) => (error, result) => this.props.callback(error, result));
  }

  render() {
    const isSubscribed = Users.getSetting(this.props.user, 'newsletter_subscribeToNewsletter', false);

    return (
      <Button className="newsletter-button" onClick={isSubscribed ? this.unsubscribeUser : this.subscribeUser} bsStyle="primary">
        {isSubscribed ? "Unsubscribe" : this.props.buttonText}
      </Button>
    )
  }
}

NewsletterButton.propTypes = {
  callback: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
  buttonText: React.PropTypes.string
};

module.exports = NewsletterButton;
export default NewsletterButton;