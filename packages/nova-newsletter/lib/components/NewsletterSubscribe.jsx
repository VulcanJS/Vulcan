import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';

// this component is used as a custom controller in user's account edit (cf. ./custom_fields.js)
class NewsletterSubscribe extends Component {

  // initiate NovaForm with the newsletter setting value
  // note: forced boolean value because NovaForm's falsy value are empty double quotes.
  componentWillMount() {
    this.context.addToAutofilledValues({[this.props.name]: !!this.props.value});
  }

  componentWillReceiveProps(nextProps, nextContext) {
    // if the user is editing her profile & subscribed to the newsletter from the banner, send the update to NovaForm
    if (!!nextProps.value !== !!this.props.value) {
      this.context.addToAutofilledValues({[this.props.name]: !!nextProps.value});
    }
  }

  render() {
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">Newsletter</label>
        <div className="col-sm-9">
          <Telescope.components.NewsletterButton 
            user={this.props.document} 
            successCallback={() => {
              this.context.messages.flash("Newsletter subscription updated", "success")
            }}
          />
        </div>
      </div>
    )
  }
}

NewsletterSubscribe.contextTypes = {
  messages: React.PropTypes.object,
  addToAutofilledValues: React.PropTypes.func,
};

module.exports = NewsletterSubscribe;
export default NewsletterSubscribe;