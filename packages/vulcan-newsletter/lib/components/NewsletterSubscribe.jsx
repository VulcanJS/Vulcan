import { Components, withMessages } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';

// this component is used as a custom controller in user's account edit (cf. ./custom_fields.js)
class NewsletterSubscribe extends Component {

  constructor(props) {
    super(props);
    
    this.handleSuccessCallback = this.handleSuccessCallback.bind(this);
    
    // note: we double bang (!!) the value to force a boolean (undefined/"" transformed to false)
    this.state = {
      label: !!props.value ? 'newsletter.unsubscribe' : 'newsletter.subscribe',
      mutationName: !!props.value ? 'removeUserNewsletter' : 'addUserNewsletter',
      currentValue: !!props.value,
    };
  }

  // initiate SmartForm with the newsletter setting value
  componentDidMount() {
    // note: forced boolean value because SmartForm's falsy value are empty double quotes.
    this.context.addToAutofilledValues({[this.props.name]: !!this.props.value});
  }
  
  handleSuccessCallback(result) {
    try {
      this.setState(
        // update the state of this component
        (prevState, props) => ({
          label: !prevState.currentValue ? 'newsletter.unsubscribe' : 'newsletter.subscribe',
          mutationName: !prevState.currentValue ? 'removeUserNewsletter' : 'addUserNewsletter',
          currentValue: !prevState.currentValue,
        }), 
        // the asynchronous setState has finished, update the form state related to this field
        () => this.context.addToAutofilledValues({[this.props.name]: this.state.currentValue})
      );
      
      // display a nice message to the client
      this.props.flash(this.context.intl.formatMessage({id: "newsletter.subscription_updated"}), "success");
    } catch(e) {
      // note: the result didn't have the shape expected, this shouldn't happen unless we change the code of our mailchimp wrapper
      this.props.flash("Something went wrong... Please contact the administrator to check the state of your newsletter subscription.");
    }
  }
  
  render() {
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3"></label>
        <div className="col-sm-9">
          <Components.NewsletterButton
            label={this.state.label}
            mutationName={this.state.mutationName}
            user={this.props.document}
            successCallback={this.handleSuccessCallback}
          />
        </div>
      </div>
    )
  }
}

NewsletterSubscribe.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  intl: intlShape
};

module.exports = withMessages(NewsletterSubscribe);
export default withMessages(NewsletterSubscribe);
