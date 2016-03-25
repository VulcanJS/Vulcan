import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';

import Core from "meteor/nova:core";
const Messages = Core.Messages;

const Input = FRC.Input;

class NewsletterForm extends Component {

  constructor() {
    super();
    this.subscribeEmail = this.subscribeEmail.bind(this);
    this.subscribeUser = this.subscribeUser.bind(this);
  }

  subscribeEmail(data) {
    console.log(data)
    Actions.call("addEmailToMailChimpList", data.email, (error, result) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(this.props.successMessage, "success");
      }
    });
  }

  subscribeUser() {
    Actions.call("addCurrentUserToMailChimpList", (error, result) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(this.props.successMessage, "success");
      }
    });
  }

  renderForm() {
    return (
      <Formsy.Form className="newsletter-form" onSubmit={this.subscribeEmail}>
        <Input
          name="email"
          value=""
          placeholder={this.props.labelText}
          type="text"
          layout="elementOnly"
        />
        <Button bsStyle="primary">{this.props.buttonText}</Button>
      </Formsy.Form>
    )
  }

  renderButton() {
    return (
      <Button className="newsletter-button" onClick={this.subscribeUser} bsStyle="primary">{this.props.buttonText}</Button>
    )
  }

  render() {
    if (Telescope.settings.get("showBanner", true)) {
      return (
        <div className="newsletter">
          <h4 className="newsletter-tagline">{this.props.headerText}</h4>
          {this.context.currentUser ? this.renderButton() : this.renderForm()}
        </div>
      )
    } else {
      return null
    }
  }
}

NewsletterForm.propTypes = {
  headerText: React.PropTypes.string,
  labelText: React.PropTypes.string,
  buttonText: React.PropTypes.string,
  successMessage: React.PropTypes.string
}

NewsletterForm.defaultProps = {
  headerText: "Subscribe to the newsletter",
  labelText: "Your Email",
  buttonText: "Subscribe",
  successMessage: "Thanks for subscribing!"
};

NewsletterForm.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = NewsletterForm;
export default NewsletterForm;