import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';
import Cookie from 'js-cookie';

import { Messages } from "meteor/nova:core";


class Newsletter extends Component {

  constructor(props, context) {
    super(props);
    this.subscribeEmail = this.subscribeEmail.bind(this);
    this.callbackSubscription = this.callbackSubscription.bind(this);
    this.dismissBanner = this.dismissBanner.bind(this);

    const showBanner =
      !(Meteor.isClient && Cookie.get('showBanner') === "no") &&
      !Users.getSetting(context.currentUser, 'newsletter_subscribeToNewsletter', false);

    this.state = {
      showBanner: showBanner
    };
  }

  subscribeEmail(data) {
    Actions.call("addEmailToMailChimpList", data.email, (error, result) => this.callbackSubscription(error, result));
  }

  callbackSubscription(error, result) {
    if (error) {
      console.log(error);
      Messages.flash(error.message, "error");
    } else {
      Messages.flash(this.props.successMessage, "success");
      this.dismissBanner();
    }
  }

  dismissBanner(e) {
    if (e && e.preventDefault) e.preventDefault();

    this.setState({showBanner: false});

    if(this.context.currentUser){
      // if user is connected, change setting in their account
      Users.setSetting(this.context.currentUser, 'newsletter_subscribeToNewsletter', false);
    } else {
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

  render() {
    const currentUser = this.context.currentUser;

    return this.state.showBanner
      ? (
        <div className="newsletter">
          <h4 className="newsletter-tagline">{this.props.headerText}</h4>
          {this.context.currentUser
            ? <Telescope.components.NewsletterButton
                callback={() => this.props.callbackSubscription}
                buttonText={this.props.buttonText}
                user={currentUser}
              />
            : this.renderForm()
          }
          <a onClick={this.dismissBanner} className="newsletter-close"><Telescope.components.Icon name="close"/></a>
        </div>
      ) : null;
  }
}

Newsletter.propTypes = {
  headerText: React.PropTypes.string,
  labelText: React.PropTypes.string,
  buttonText: React.PropTypes.string,
  successMessage: React.PropTypes.string
};

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