import { Components, registerComponent, withMutation, withCurrentUser, withMessages, Utils } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import { Button } from 'react-bootstrap';

class NewsletterButton extends Component {
  constructor(props) {
    super(props);
    this.subscriptionAction = this.subscriptionAction.bind(this);
  }
  
  // use async/await + try/catch <=> promise.then(res => ..).catch(e => ...)
  async subscriptionAction() {
    
    const { 
      flash, 
      mutationName, 
      successCallback, 
      user, 
      [mutationName]: mutationToTrigger, // dynamic 'mutationToTrigger' variable based on the mutationName (addUserNewsletter or removeUserNewsletter)
    } = this.props;
    
    try {
      const mutationResult = await mutationToTrigger({userId: user._id});
      
      successCallback(mutationResult);
    } catch(error) {
      console.error(error); // eslint-disable-line no-console
      flash(
        this.context.intl.formatMessage(Utils.decodeIntlError(error)),
        "error"
      );
    }
  }

  render() {
    
    return (
      <Button
        className="newsletter-button"
        onClick={this.subscriptionAction}
        bsStyle="primary"
      >
        <FormattedMessage id={this.props.label}/>
      </Button>
    )
  }
}

NewsletterButton.propTypes = {
  mutationName: PropTypes.string.isRequired, // mutation to fire
  label: PropTypes.string.isRequired, // label of the button
  user: PropTypes.object.isRequired, // user to operate on
  successCallback: PropTypes.func.isRequired, // what do to after the mutationName
  addUserNewsletter: PropTypes.func.isRequired, // prop given by withMutation HOC
  removeUserNewsletter: PropTypes.func.isRequired, // prop given by withMutation HOC
};

NewsletterButton.contextTypes = {
  intl: intlShape,
};

const addOptions = {name: 'addUserNewsletter', args: {userId: 'String'}};
const removeOptions = {name: 'removeUserNewsletter', args: {userId: 'String'}};

registerComponent('NewsletterButton', NewsletterButton, withCurrentUser, withMutation(addOptions), withMutation(removeOptions), withMessages);
