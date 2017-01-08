import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import { withMutation, withCurrentUser, withMessages } from 'meteor/nova:core';

class NewsletterButton extends Component {
  constructor(props) {
    super(props);
    this.subscriptionAction = this.subscriptionAction.bind(this);

    const isSubscribed = props.user.__newsletter_subscribeToNewsletter;

    this.state = {
      labelId: isSubscribed ? 'newsletter.unsubscribe' : 'newsletter.subscribe',
      action: isSubscribed ? 'removeUserNewsletter' : 'addUserNewsletter'
    };
  }

  subscriptionAction() {

    const action = this.state.action;
    this.props[action]({userId: this.props.user._id}).then(result => {
      this.props.successCallback(result);
      // note: cannot update state, the component is unmounted when we try to update it 
      // console.log(result);
      // if (result.data[action].actionResult === 'subscribed') {
      //   this.setState({
      //     labelId: 'newsletter.unsubscribe',
      //     action: 'removeUserNewsletter',
      //   });
      // } else {
      //   this.setState({
      //     labelId: 'newsletter.subscribe',
      //     action: 'addUserNewsletter',
      //   });
      // }
    }).catch(error => {
      console.log(error); // eslint-disable-line no-console
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
  user: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func.isRequired,
};

NewsletterButton.contextTypes = {
  actions: React.PropTypes.object,
};

const addOptions = {name: 'addUserNewsletter', args: {userId: 'String'}};
const removeOptions = {name: 'removeUserNewsletter', args: {userId: 'String'}};

registerComponent('NewsletterButton', NewsletterButton, withCurrentUser, withMutation(addOptions), withMutation(removeOptions), withMessages);
