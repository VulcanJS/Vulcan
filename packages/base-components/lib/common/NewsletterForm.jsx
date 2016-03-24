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
      <Formsy.Form onSubmit={this.subscribeEmail}>
        <Input
          name="email"
          value=""
          label={this.props.labelText}
          type="text"
        />
        <Button bsStyle="primary">{this.props.buttonText}</Button>
      </Formsy.Form>
    )
  }

  renderButton() {
    return (
      <Button onClick={this.subscribeUser} bsStyle="primary">{this.props.buttonText}</Button>
    )
  }

  render() {
    if (Telescope.settings.get("showBanner", true)) {
      return (
        <div className="newsletter">
          <h3>{this.props.headerText}</h3>
          {this.props.currentUser ? this.renderButton() : this.renderForm()}
        </div>
      )
    } else {
      return null
    }
  }
}

NewsletterForm.propTypes = {
  currentUser: React.PropTypes.object,
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

module.exports = NewsletterForm;
export default NewsletterForm;