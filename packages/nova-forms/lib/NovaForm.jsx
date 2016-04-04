import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';

import FormComponent from "./FormComponent.jsx";
import Utils from './utils.js';

class NovaForm extends Component{
  
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.methodCallback = this.methodCallback.bind(this);
    this.updateState = this.updateState.bind(this);
    this.throwError = this.throwError.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.state = {
      disabled: false,
      errors: [],
      currentValues: this.props.document
    };
  }

  // if a document is being passed, this is an edit form
  getFormType() { 
    return this.props.document ? "edit" : "new";
  }

  // get relevant fields
  getFields() { 
    const collection = this.props.collection;
    const fields = this.getFormType() === "edit" ? collection.getEditableFields(this.props.currentUser) : collection.getInsertableFields(this.props.currentUser);
    return fields;
  }

  // add error to state
  throwError(error) {
    this.setState({
      errors: [error]
    });
  }

  // clear all errors
  clearErrors() {
    this.setState({
      errors: []
    });
  }

  // render errors
  renderErrors() {
    Flash = Telescope.components.Flash;
    return <div className="form-errors">{this.state.errors.map(message => <Flash key={message} message={message}/>)}</div>
  }

  // whenever the form values change, keep track of them in the state
  updateState(e) {
    // e can sometimes be event, sometims be currentValue
    // see https://github.com/christianalfoni/formsy-react/issues/203
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      this.setState({
        currentValues: e
      });
    }
  }

  // pass on form values as context to all child components for easy access
  getChildContext() {
    return {
      throwError: this.throwError,
      currentValues: this.state.currentValues
    };
  }

  // common callback for both new and edit forms
  methodCallback(error, document) {

    this.setState({disabled: false});
    
    if (error) { // error

      console.log(error)

      // add error to state
      this.throwError({
        content: error.message,
        type: "error"
      });

      // run error callback if it exists
      if (this.props.errorCallback) this.props.errorCallback(document, error);

    } else { // success

      this.clearErrors();

      // reset form if this is a new document form
      if (this.getFormType() === "new") this.refs.form.reset();

      // run success callback if it exists
      if (this.props.successCallback) this.props.successCallback(document);

      // run close callback if it exists in context (i.e. we're inside a modal)
      if (this.context.closeCallback) this.context.closeCallback();
    
    }
  }

  // submit form handler
  submitForm(data) {
    this.setState({disabled: true});

    const fields = this.getFields();
    const collection = this.props.collection;

    // if there's a submit callback, run it
    if (this.props.submitCallback) this.props.submitCallback();
    
    if (this.getFormType() === "new") { // new document form

      // remove any empty properties
      let document = _.compactObject(Utils.flatten(data));

      // add prefilled properties
      if (this.props.prefilledProps) {
        document = Object.assign(document, this.props.prefilledProps);
      }

      // call method with new document
      Meteor.call(this.props.methodName, document, this.methodCallback);

    } else { // edit document form

      const document = this.props.document;

      // put all keys with data on $set
      const set = _.compactObject(Utils.flatten(data));
      
      // put all keys without data on $unset
      const unsetKeys = _.difference(fields, _.keys(set));
      const unset = _.object(unsetKeys, unsetKeys.map(()=>true));
      
      // build modifier
      const modifier = {$set: set};
      if (!_.isEmpty(unset)) modifier.$unset = unset;
      // call method with _id of document being edited and modifier
      Meteor.call(this.props.methodName, document._id, modifier, this.methodCallback);

    }

  }

  render() {

    const document = this.props.document;
    const collection = this.props.collection;
    const fields = this.getFields();

    const style = {
      maxWidth: "800px",
      width: "100%"
    }

    return (
      <div className={"document-"+this.getFormType()} style={style}>
        <Formsy.Form onSubmit={this.submitForm} onChange={this.updateState} disabled={this.state.disabled} ref="form">
          {this.renderErrors()}
          {fields.map(fieldName => <FormComponent 
            key={fieldName}
            className={"input-"+fieldName}
            fieldName={fieldName}
            field={collection.simpleSchema()._schema[fieldName]}
            labelFunction={this.props.labelFunction}
            document={document}
          />)}
          <Button type="submit" bsStyle="primary">Submit</Button>
        </Formsy.Form>
      </div>
    )
  }

}

NovaForm.propTypes = {
  collection: React.PropTypes.object.isRequired,
  document: React.PropTypes.object, // if a document is passed, this will be an edit form
  currentUser: React.PropTypes.object,
  submitCallback: React.PropTypes.func,
  successCallback: React.PropTypes.func,
  errorCallback: React.PropTypes.func,
  methodName: React.PropTypes.string,
  labelFunction: React.PropTypes.func,
  prefilledProps: React.PropTypes.object
}

NovaForm.contextTypes = {
  closeCallback: React.PropTypes.func
}

NovaForm.childContextTypes = {
  currentValues: React.PropTypes.object,
  throwError: React.PropTypes.func
}

module.exports = NovaForm;
export default NovaForm;