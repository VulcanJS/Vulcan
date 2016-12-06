import Telescope, { Components } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
          <Components.NewsletterButton 
            user={this.props.document} 
            successCallback={() => {
              this.props.flash("Newsletter subscription updated", "success")
            }}
          />
        </div>
      </div>
    )
  }
}

NewsletterSubscribe.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(NewsletterSubscribe);
export default connect(mapStateToProps, mapDispatchToProps)(NewsletterSubscribe);