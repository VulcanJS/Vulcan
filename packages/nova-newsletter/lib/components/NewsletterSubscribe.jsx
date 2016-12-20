import { Components } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { withMessages } from 'meteor/nova:core';
import { intlShape } from 'react-intl';

// this component is used as a custom controller in user's account edit (cf. ./custom_fields.js)
class NewsletterSubscribe extends Component {

  // initiate SmartForm with the newsletter setting value
  // note: forced boolean value because SmartForm's falsy value are empty double quotes.
  componentWillMount() {
    this.context.addToAutofilledValues({[this.props.name]: !!this.props.value});
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // if the user is editing her profile & subscribed to the newsletter from the banner, send the update to SmartForm
    if (!!nextProps.value !== !!this.props.value) {
      this.context.addToAutofilledValues({[this.props.name]: !!nextProps.value});
    }
  }

  render() {
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3"></label>
        <div className="col-sm-9">
          <Components.NewsletterButton
            user={this.props.document}
            successCallback={() => {
              this.props.flash(this.context.intl.formatMessage({id: "newsletter.subscription_updated"}), "success")
            }}
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
