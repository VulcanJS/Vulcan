import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import Formsy from 'formsy-react';
import { Input } from 'formsy-react-components';
import { Button } from 'react-bootstrap';
import Cookie from 'react-cookie';
import Users from 'meteor/nova:users';

class Newsletter extends Component {

  constructor(props, context) {
    super(props);
    this.subscribeEmail = this.subscribeEmail.bind(this);
    this.successCallbackSubscription = this.successCallbackSubscription.bind(this);
    this.dismissBanner = this.dismissBanner.bind(this);

    this.state = {
      showBanner: showBanner(context.currentUser)
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.currentUser) {
      this.setState({showBanner: showBanner(nextContext.currentUser)});
    }
  }

  subscribeEmail(data) {
    this.context.actions.call("newsletter.addEmail", data.email, (error, result) => {
      if (error) {
        console.log(error); // eslint-disable-line
        this.context.messages.flash(error.message, "error");
      } else {
        this.successCallbackSubscription(result);
      }
    });
  }

  successCallbackSubscription(result) {
    this.context.messages.flash(this.context.intl.formatMessage({id: "newsletter.success_message"}), "success");
    this.dismissBanner();
  }

  dismissBanner(e) {
    if (e && e.preventDefault) e.preventDefault();

    this.setState({showBanner: false});

    // set cookie
    Cookie.save('showBanner', "no");

    // set user setting too (if logged in)
    if (this.context.currentUser) {
      this.context.actions.call('users.setSetting', this.context.currentUser._id, 'newsletter.showBanner', false);
    }
  }

  renderButton() {
    return <Telescope.components.NewsletterButton
              successCallback={() => this.successCallbackSubscription()}
              subscribeText={this.context.intl.formatMessage({id: "newsletter.subscribe"})}
              user={this.context.currentUser}
            />
  }

  renderForm() {
    return (
      <Formsy.Form className="newsletter-form" onSubmit={this.subscribeEmail}>
        <Input
          name="email"
          value=""
          placeholder={this.context.intl.formatMessage({id: "newsletter.email"})}
          type="text"
          layout="elementOnly"
        />
        <Button className="newsletter-button" type="submit" bsStyle="primary"><FormattedMessage id="newsletter.subscribe"/></Button>
      </Formsy.Form>
    )
  }

  render() {
    return this.state.showBanner
      ? (
        <div className="newsletter">
          <h4 className="newsletter-tagline"><FormattedMessage id="newsletter.subscribe_prompt"/></h4>
          {this.context.currentUser ? this.renderButton() : this.renderForm()}
          <a onClick={this.dismissBanner} className="newsletter-close"><Telescope.components.Icon name="close"/></a>
        </div>
      ) : null;
  }
}

Newsletter.contextTypes = {
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  messages: React.PropTypes.object,
  intl: intlShape
};

function showBanner (user) {
  return (
    // showBanner cookie either doesn't exist or is not set to "no"
    Cookie.load('showBanner') !== "no"
    // and showBanner user setting either doesn't exist or is set to true
    && Users.getSetting(user, 'newsletter.showBanner', true)
    // and user is not subscribed to the newsletter already (setting either DNE or is not set to false)
    && !Users.getSetting(user, 'newsletter.subscribed', false)
  );
}

module.exports = Newsletter;
export default Newsletter;
