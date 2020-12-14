import { Components, registerComponent, withMutation, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// this component is used as a custom controller in user's account edit (cf. ./custom_fields.js)
class NewsletterSubscribe extends PureComponent {
  
  // check if fields is true or falsy (no value = not subscribed)
  isSubscribed = () => {
    return !!this.props.value;
  }

  subscribeUnsubscribe = async () => {
    
    const { path, updateCurrentValues, throwError } = this.props;
    
    const user = this.props.document;
    const mutationName = this.isSubscribed() ? 'removeUserNewsletter' : 'addUserNewsletter';
    const mutation = this.props[mutationName];

    try {

      await mutation({userId: user._id});

      updateCurrentValues({ [path]: !this.isSubscribed() });
      
      // display a nice message to the client
      this.props.flash({ id: 'newsletter.subscription_updated', type: 'success'});
      
    } catch(error) {
      throwError(error);
    }
  }
  
  render() {

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3"></label>
          <div className="col-sm-9">
            <Components.Button
              className="newsletter-button"
              onClick={this.subscribeUnsubscribe}
              variant="primary"
            >
              <Components.FormattedMessage id={this.isSubscribed() ? 'newsletter.unsubscribe' : 'newsletter.subscribe'}/>
            </Components.Button>
        </div>
      </div>
    );
  }
}

const addOptions = {name: 'addUserNewsletter', args: {userId: 'String'}};
const removeOptions = {name: 'removeUserNewsletter', args: {userId: 'String'}};

registerComponent('NewsletterSubscribe', NewsletterSubscribe, withMutation(addOptions), withMutation(removeOptions), withMessages);
