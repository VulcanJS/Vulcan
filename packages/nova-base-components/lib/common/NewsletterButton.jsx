import Telescope, { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap';
import { Messages } from 'meteor/nova:core';
import Users from 'meteor/nova:users';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class NewsletterButton extends Component {
  constructor(props) {
    super(props);
    this.subscriptionAction = this.subscriptionAction.bind(this);
  }
  
  subscriptionAction() {
    const action = Users.getSetting(this.props.user, 'newsletter_subscribeToNewsletter', false) ? 
      'newsletter.removeUser' : 'newsletter.addUser';

    this.context.actions.call(action, this.props.user, (error, result) => {
      if (error) {
        console.log(error);
        this.props.flash(error.message, "error");
      } else {
        this.props.successCallback(result);
      }
    });
  }

  render() {
    const isSubscribed = Users.getSetting(this.props.user, 'newsletter_subscribeToNewsletter', false);

    return (
      <Button
        className="newsletter-button"
        onClick={this.subscriptionAction}
        bsStyle="primary"
      >
        {isSubscribed ? <FormattedMessage id="newsletter.unsubscribe"/> : <FormattedMessage id="newsletter.subscribe"/>}
      </Button>
    )
  }
}

NewsletterButton.propTypes = {
  successCallback: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired,
};

NewsletterButton.contextTypes = {
  actions: React.PropTypes.object,
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

registerComponent('NewsletterButton', NewsletterButton, connect(mapStateToProps, mapDispatchToProps));