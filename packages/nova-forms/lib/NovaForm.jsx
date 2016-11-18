import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';
import Flash from "./Flash.jsx";
import FormGroup from "./FormGroup.jsx";
import { flatten, deepValue, getEditableFields, getInsertableFields } from './utils.js';

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
    this.formKeyDown = this.formKeyDown.bind(this);

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

  // return the current schema based on either the schema or collection prop
  getSchema() {
    return this.props.schema ? this.props.schema : this.props.collection.simpleSchema()._schema;
  }

  getFieldGroups() {

    const schema = this.getSchema();

    // build fields array by iterating over the list of field names
    let fields = this.getFieldNames().map(fieldName => {

      // get schema for the current field
      const fieldSchema = schema[fieldName];

      fieldSchema.name = fieldName;

      // intialize properties
      let field = {
        name: fieldName,
        datatype: fieldSchema.type,
        control: fieldSchema.control,
        layout: this.props.layout,
        order: fieldSchema.order
      }

      // add label
      const intlFieldName = this.context.intl.formatMessage({id: this.props.collection._name+"."+fieldName});
      field.label = (typeof this.props.labelFunction === "function") ? this.props.labelFunction(intlFieldName) : intlFieldName,

      // add value
      field.value = this.getDocument() && deepValue(this.getDocument(), fieldName) ? deepValue(this.getDocument(), fieldName) : "";

      // backward compatibility from 'autoform' to 'form'
      if (fieldSchema.autoform) {
        fieldSchema.form = fieldSchema.autoform;
        console.warn(`🔭 Telescope Nova Warning: The 'autoform' field is deprecated. You should rename it to 'form' instead. It was defined on your '${fieldName}' field  on the '${this.props.collection._name}' collection`); // eslint-disable-line
      }

      // replace value by prefilled value if value is empty
      if (fieldSchema.form && fieldSchema.form.prefill) {
        const prefilledValue = typeof fieldSchema.form.prefill === "function" ? fieldSchema.form.prefill.call(fieldSchema) : fieldSchema.form.prefill;
        if (!!prefilledValue && !field.value) {
          field.prefilledValue = prefilledValue;
          field.value = prefilledValue;
        }
      }

      // replace empty value, which has not been prefilled, by the default value from the schema
      if (fieldSchema.defaultValue && field.value === "") {
        field.value = fieldSchema.defaultValue;
      }

      // add options if they exist
      if (fieldSchema.form && fieldSchema.form.options) {
        field.options = typeof fieldSchema.form.options === "function" ? fieldSchema.form.options.call(fieldSchema) : fieldSchema.form.options;
      }

      if (fieldSchema.form && fieldSchema.form.disabled) {
        field.disabled = typeof fieldSchema.form.disabled === "function" ? fieldSchema.form.disabled.call(fieldSchema) : fieldSchema.form.disabled;
      }

      if (fieldSchema.form && fieldSchema.form.help) {
        field.help = typeof fieldSchema.form.help === "function" ? fieldSchema.form.help.call(fieldSchema) : fieldSchema.form.help;
      }

      // add placeholder
      if (fieldSchema.form && fieldSchema.form.placeholder) {
       field.placeholder = fieldSchema.form.placeholder;
      }

      if (fieldSchema.beforeComponent) field.beforeComponent = fieldSchema.beforeComponent;
      if (fieldSchema.afterComponent) field.afterComponent = fieldSchema.afterComponent;

      // add group
      if (fieldSchema.group) {
        field.group = fieldSchema.group;
      }

      // add document
      field.document = this.getDocument();

      return field;

    });

    // remove fields where control = "none"
    fields = _.reject(fields, field => field.control === "none");
    fields = _.sortBy(fields, "order");

    // console.log(fields)

    // get list of all groups used in current fields
    let groups = _.compact(_.unique(_.pluck(fields, "group")));

    // for each group, add relevant fields
    groups = groups.map(group => {
      group.label = group.label || this.context.intl.formatMessage({id: group.name});
      group.fields = _.filter(fields, field => {return field.group && field.group.name === group.name});
      return group;
    });

    // add default group
    groups = [{
      name: "default",
      label: "default",
      order: 0,
      fields: _.filter(fields, field => {return !field.group;})
    }].concat(groups);

    // sort by order
    groups = _.sortBy(groups, "order");

    // console.log(groups);

    return groups;
  }

  // if a document is being passed, this is an edit form
  getFormType() {
    return this.props.document ? "edit" : "new";
  }

  // get relevant fields
  getFieldNames() {
    const fields = this.props.fields;

    // get all editable/insertable fields (depending on current form type)
    let relevantFields = this.getFormType() === "edit" ? getEditableFields(this.getSchema(), this.context.currentUser, this.getDocument()) : getInsertableFields(this.getSchema(), this.context.currentUser);

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

  // clear all errors and re-enable the form
  clearErrors() {
    this.setState({
      errors: [],
      disabled: false,
    });
  }

  // render errors
  renderErrors() {
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
    this.setState(function(state){
      return {
        autofilledValues: {
          ...state.autofilledValues,
          ...property
        }
      };
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
      updateCurrentValue: this.updateCurrentValue,
      getDocument: this.getDocument,
    };
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Method ------------------------------ //
  // --------------------------------------------------------------------- //

  // common callback for both new and edit forms
  methodCallback(error, document) {

    if (error) { // error

      this.setState({disabled: false});

      console.log(error); // eslint-disable-line

      const errorContent = this.context.intl.formatMessage({id: error.reason}, {details: error.details})
      // add error to state
      this.throwError({
        content: errorContent,
        type: "error"
      });

      // run error callback if it exists
      if (this.props.errorCallback) this.props.errorCallback(document, error);

    } else { // success

      // reset form if this is a new document form
      if (this.getFormType() === "new") this.refs.form.reset();

      // run success callback if it exists
      if (this.props.successCallback) this.props.successCallback(document);

      // run close callback if it exists in context (i.e. we're inside a modal)
      if (this.context.closeCallback) this.context.closeCallback();
      // else there is no close callback (i.e. we're not inside a modal), call the clear errors method
      // note: we don't want to update the state of an unmounted component
      else this.clearErrors();

    }
  }

  // submit form handler
  submitForm(data) {
    this.setState({disabled: true});

    // complete the data with values from custom components which are not being catched by Formsy mixin
    // note: it follows the same logic as NovaForm's getDocument method
    data = {
      ...this.state.autofilledValues, // ex: can be values from EmbedlyURL or NewsletterSubscribe component
      ...data, // original data generated thanks to Formsy
      ...this.state.currentValues, // ex: can be values from DateTime component
    };

    const fields = this.getFieldNames();

    // if there's a submit callback, run it
    if (this.props.submitCallback) {
      data = this.props.submitCallback(data);
    }

    if (this.getFormType() === "new") { // new document form

      // remove any empty properties
      let document = _.compactObject(flatten(data));

      // add prefilled properties
      if (this.props.prefilledProps) {
        document = Object.assign(document, this.props.prefilledProps);
      }

      // call method with new document
      Meteor.call(this.props.methodName, document, this.methodCallback);

    } else { // edit document form

      const document = this.getDocument();

      // put all keys with data on $set
      const set = _.compactObject(flatten(data));

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

  componentWillUnmount() {
    // note: patch to cancel closeCallback given by parent
    // we clean the event by hand
    // example : the closeCallback is a function that closes a modal by calling setState, this modal being the parent of this NovaForm component
    // if this componentWillUnmount hook is triggered, that means that the modal doesn't exist anymore!
    // let's not call setState on an unmounted component (avoid no-op / memory leak)
    this.context.closeCallback = f => f;
  }

  // key down handler
  formKeyDown(event) {

    if( (event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm(this.refs.form.getModel());
    }
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Render ------------------------------ //
  // --------------------------------------------------------------------- //

  render() {

    const fieldGroups = this.getFieldGroups();

    return (
      <div className={"document-"+this.getFormType()}>
        <Formsy.Form
          onSubmit={this.submitForm}
          onKeyDown={this.formKeyDown}
          disabled={this.state.disabled}
          ref="form"
        >
          {this.renderErrors()}
          {fieldGroups.map(group => <FormGroup key={group.name} {...group} updateCurrentValue={this.updateCurrentValue} />)}
          <Button type="submit" bsStyle="primary"><FormattedMessage id="forms.submit"/></Button>
          {this.props.cancelCallback ? <a className="form-cancel" onClick={this.props.cancelCallback}><FormattedMessage id="forms.cancel"/></a> : null}
        </Formsy.Form>
      </div>
    )
  }

}

NovaForm.propTypes = {
  collection: React.PropTypes.object,
  schema: React.PropTypes.object,
  document: React.PropTypes.object, // if a document is passed, this will be an edit form
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

NovaForm.defaultProps = {
  layout: "horizontal"
}

NovaForm.contextTypes = {
  closeCallback: React.PropTypes.func,
  currentUser: React.PropTypes.object,
  intl: intlShape
}

NovaForm.childContextTypes = {
  autofilledValues: React.PropTypes.object,
  addToAutofilledValues: React.PropTypes.func,
  updateCurrentValue: React.PropTypes.func,
  throwError: React.PropTypes.func,
  getDocument: React.PropTypes.func
}

module.exports = NovaForm;
export default NovaForm;
