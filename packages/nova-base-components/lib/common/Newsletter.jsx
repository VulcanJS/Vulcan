import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';
import Cookie from 'js-cookie';

import { Messages } from "meteor/nova:core";

const Input = FRC.Input;


class Newsletter extends Component {

  constructor(props, context) {
    super(props);
    this.subscribeEmail = this.subscribeEmail.bind(this);
    this.subscribeUser = this.subscribeUser.bind(this);
    this.dismissBanner = this.dismissBanner.bind(this);

    const showBanner = 
      !(Meteor.isClient && Cookie.get('showBanner') === "no") &&
      Users.getSetting(context.currentUser, 'newsletter_showBanner', true) &&
      !Users.getSetting(context.currentUser, 'newsletter_subscribeToNewsletter', false);

    this.state = {
      showBanner: showBanner
    };
  }

  subscribeEmail(data) {
    Actions.call("addEmailToMailChimpList", data.email, (error, result) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error");
      } else {
        Messages.flash(this.props.successMessage, "success");
        this.dismissBanner();
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
        this.dismissBanner();
      }
    });
  }

  dismissBanner(e) {
    
    if (e && e.preventDefault) e.preventDefault();

    this.setState({showBanner: false});

    if(this.context.currentUser){
      // if user is connected, change setting in their account
      Users.setSetting(this.context.currentUser, 'newsletter_showBanner', false);
    }else{
      // set cookie
      Cookie.set('showBanner', "no");
    }
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
        <Button className="newsletter-button" type="submit" bsStyle="primary">{this.props.buttonText}</Button>
      </Formsy.Form>
    )
  }

  renderButton() {
    return (
      <Button className="newsletter-button" onClick={this.subscribeUser} bsStyle="primary">{this.props.buttonText}</Button>
    )
  }

  render() {

    const currentUser = this.context.currentUser;

    if (this.state.showBanner) {
      return (
        <div className="newsletter">
          <h4 className="newsletter-tagline">{this.props.headerText}</h4>
          {this.context.currentUser ? this.renderButton() : this.renderForm()}
          <a onClick={this.dismissBanner} className="newsletter-close"><Telescope.components.Icon name="close"/></a>
        </div>
      );
    } else {
      return null;
    }
  }
}

Newsletter.propTypes = {
  headerText: React.PropTypes.string,
  labelText: React.PropTypes.string,
  buttonText: React.PropTypes.string,
  successMessage: React.PropTypes.string
}

Newsletter.defaultProps = {
  headerText: "Subscribe to the newsletter",
  labelText: "Your Email",
  buttonText: "Subscribe",
  successMessage: "Thanks for subscribing!"
};

Newsletter.contextTypes = {
  currentUser: React.PropTypes.object
};

module.exports = Newsletter;
export default Newsletter;