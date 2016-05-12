import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';

import FormComponent from "./FormComponent.jsx";
import Utils from './utils.js';

/*

1. Constructor
2. Helpers
3. Errors
4. Context
4. Method & Callback
5. Render

*/

class NovaForm extends Component{
  
  // --------------------------------------------------------------------- //
  // ----------------------------- Constructor --------------------------- //
  // --------------------------------------------------------------------- //

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.updateState = this.updateState.bind(this);
    this.methodCallback = this.methodCallback.bind(this);
    this.addToAutofilledValues = this.addToAutofilledValues.bind(this);
    this.throwError = this.throwError.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.updateCurrentValue = this.updateCurrentValue.bind(this);

    // a debounced version of seState that only updates state every 500 ms (not used)
    this.debouncedSetState = _.debounce(this.setState, 500);
  
    this.state = {
      disabled: false,
      errors: [],
      autofilledValues: {},
      currentValues: {}
    };
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Helpers ----------------------------- //
  // --------------------------------------------------------------------- //

  // if a document is being passed, this is an edit form
  getFormType() { 
    return this.props.document ? "edit" : "new";
  }

  // get relevant fields
  getFieldNames() {
    const { collection, fields } = this.props;

    // get all editable/insertable fields (depending on current form type)
    let relevantFields = this.getFormType() === "edit" ? collection.getEditableFields(this.props.currentUser, this.getDocument()) : collection.getInsertableFields(this.props.currentUser);

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== "undefined" && fields.length > 0) {
      relevantFields = _.intersection(relevantFields, fields);
    }

    return relevantFields;
  }

  // for each field, we apply the following logic:
  // - if its value is currently being inputted, use that
  // - else if its value was provided by the db, use that (i.e. props.document)
  // - else if its value is provded by the autofilledValues object, use that
  getDocument() {
    const currentDocument = _.clone(this.props.document) || {};
    const document = Object.assign(_.clone(this.state.autofilledValues), currentDocument,  _.clone(this.state.currentValues));
    return document;
  }

  // NOTE: this is not called anymore since we're updating on blur, not on change
  // whenever the form changes, update its state
  updateState(e) {
    // e can sometimes be event, sometims be currentValue
    // see https://github.com/christianalfoni/formsy-react/issues/203
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      // get rid of empty fields
      _.forEach(e, (value, key) => {
        if (_.isEmpty(value)) {
          delete e[key];
        }
      });
      this.setState({
        currentValues: e
      });
    }
  }

  // manually update current value (i.e. on blur). See above for on change instead
  updateCurrentValue(fieldName, fieldValue) {
    const currentValues = this.state.currentValues;
    currentValues[fieldName] = fieldValue;
    this.setState({currentValues: currentValues});
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Errors ------------------------------ //
  // --------------------------------------------------------------------- //

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

  // --------------------------------------------------------------------- //
  // ------------------------------- Context ----------------------------- //
  // --------------------------------------------------------------------- //
  
  // add error to state
  throwError(error) {
    this.setState({
      errors: [error]
    });
  }

  // add something to prefilled values
  addToAutofilledValues(property) {
    this.setState({
      autofilledValues: {...this.state.autofilledValues, ...property}
    });
  }

  // clear value
  clearValue(property) {

  }

  // pass on context to all child components
  getChildContext() {
    return {
      throwError: this.throwError,
      autofilledValues: this.state.autofilledValues,
      addToAutofilledValues: this.addToAutofilledValues,
      updateCurrentValue: this.updateCurrentValue
    };
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Method ------------------------------ //
  // --------------------------------------------------------------------- //

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

    const fields = this.getFieldNames();
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

      const document = this.getDocument();

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

  // --------------------------------------------------------------------- //
  // ------------------------------- Render ------------------------------ //
  // --------------------------------------------------------------------- //

  render() {
    
    // build fields array by iterating over the list of field names
    let fields = this.getFieldNames().map(fieldName => {
        
      // get schema for the current field
      const fieldSchema = this.props.collection.simpleSchema()._schema[fieldName]
      fieldSchema.name = fieldName;

      // add name, label, and type properties
      let field = {
        name: fieldName,
        label: (typeof this.props.labelFunction === "function") ? this.props.labelFunction(fieldName) : fieldName,
        datatype: fieldSchema.type,
        control: fieldSchema.control,
        layout: this.props.layout
      }

      // add value
      field.value = this.getDocument() && Utils.deepValue(this.getDocument(), fieldName) ? Utils.deepValue(this.getDocument(), fieldName) : "";  

      // replace value by prefilled value if value is empty
      if (fieldSchema.autoform && fieldSchema.autoform.prefill) {
        const prefilledValue = typeof fieldSchema.autoform.prefill === "function" ? fieldSchema.autoform.prefill.call(fieldSchema) : fieldSchema.autoform.prefill;
        if (!!prefilledValue && !field.value) {
          field.prefilledValue = prefilledValue;
          field.value = prefilledValue;
        }
      }

      // add options if they exist
      if (fieldSchema.autoform && fieldSchema.autoform.options) {
        field.options = typeof fieldSchema.autoform.options === "function" ? fieldSchema.autoform.options.call(fieldSchema) : fieldSchema.autoform.options;
      }

      if (fieldSchema.autoform && fieldSchema.autoform.disabled) {
        field.disabled = typeof fieldSchema.autoform.disabled === "function" ? fieldSchema.autoform.disabled.call(fieldSchema) : fieldSchema.autoform.disabled;
      }

      if (fieldSchema.autoform && fieldSchema.autoform.help) {
        field.help = typeof fieldSchema.autoform.help === "function" ? fieldSchema.autoform.help.call(fieldSchema) : fieldSchema.autoform.help;
      }

      return field;

    });

    // console.log(fields)

    // remove fields where control = "none"
    fields = _.reject(fields, field => field.control === "none");

    return (
      <div className={"document-"+this.getFormType()}>
        <Formsy.Form 
          onSubmit={this.submitForm} 
          disabled={this.state.disabled} 
          ref="form" 
        >
          {this.renderErrors()}
          {fields.map(field => <FormComponent key={field.name} {...field} updateCurrentValue={this.updateCurrentValue} />)}
          <Button type="submit" bsStyle="primary">Submit</Button>
          {this.props.cancelCallback ? <a className="form-cancel" onClick={this.props.cancelCallback}>Cancel</a> : null}
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
  prefilledProps: React.PropTypes.object,
  layout: React.PropTypes.string,
  cancelCallback: React.PropTypes.func,
  fields: React.PropTypes.arrayOf(React.PropTypes.string)
}

NovaForm.defaultPropTypes = {
  layout: "horizontal"
}

NovaForm.contextTypes = {
  closeCallback: React.PropTypes.func
}

NovaForm.childContextTypes = {
  autofilledValues: React.PropTypes.object,
  addToAutofilledValues: React.PropTypes.func,
  updateCurrentValue: React.PropTypes.func,
  throwError: React.PropTypes.func
}

module.exports = NovaForm;
export default NovaForm;