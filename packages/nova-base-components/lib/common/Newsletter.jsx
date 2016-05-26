import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import Actions from "../actions.js";
import { Button } from 'react-bootstrap';
import Cookie from 'react-cookie';

import { Messages } from "meteor/nova:core";


class Newsletter extends Component {

  constructor(props, context) {
    super(props);
    this.subscribeEmail = this.subscribeEmail.bind(this);
    this.successCallbackSubscription = this.successCallbackSubscription.bind(this);
    this.dismissBanner = this.dismissBanner.bind(this);

    const showBanner =
      Cookie.load('showBanner') !== "no" &&
      !Users.getSetting(context.currentUser, 'newsletter_subscribeToNewsletter', false);

    this.state = {
      showBanner: showBanner
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.currentUser) {
      const showBanner =
        Cookie.load('showBanner') !== "no" &&
        !Users.getSetting(nextContext.currentUser, 'newsletter_subscribeToNewsletter', false);

      this.setState({showBanner});
    }
  }

  subscribeEmail(data) {
    Actions.call("newsletter.addEmail", data.email, (error, result) => {
      if (error) {
        console.log(error);
        Messages.flash(error.message, "error");
      } else {
        this.successCallbackSubscription(result);
      }
    });
  }

  successCallbackSubscription(result) {
    Messages.flash(this.props.successMessage, "success");
    this.dismissBanner();
  }

  dismissBanner(e) {
    if (e && e.preventDefault) e.preventDefault();

    this.setState({showBanner: false});

    // set cookie
    Cookie.save('showBanner', "no");
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
                successCallback={() => this.successCallbackSubscription}
                subscribeText={this.props.buttonText}
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