/*

Main form component.

This component expects:

### All Forms:

- collection
- currentUser
- client (Apollo client)

### New Form:

- newMutation

### Edit Form:

- editMutation
- removeMutation
- document

*/

import { Components, Utils } from 'meteor/vulcan:core';
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

class Form extends Component {

  // --------------------------------------------------------------------- //
  // ----------------------------- Constructor --------------------------- //
  // --------------------------------------------------------------------- //

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.updateState = this.updateState.bind(this);
    // this.methodCallback = this.methodCallback.bind(this);
    this.newMutationSuccessCallback = this.newMutationSuccessCallback.bind(this);
    this.editMutationSuccessCallback = this.editMutationSuccessCallback.bind(this);
    this.mutationSuccessCallback = this.mutationSuccessCallback.bind(this);
    this.mutationErrorCallback = this.mutationErrorCallback.bind(this);
    this.addToAutofilledValues = this.addToAutofilledValues.bind(this);
    this.addToDeletedValues = this.addToDeletedValues.bind(this);
    this.throwError = this.throwError.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.updateCurrentValues = this.updateCurrentValues.bind(this);
    this.formKeyDown = this.formKeyDown.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    // a debounced version of seState that only updates state every 500 ms (not used)
    this.debouncedSetState = _.debounce(this.setState, 500);
    this.setFormState = this.setFormState.bind(this);

    this.state = {
      disabled: false,
      errors: [],
      autofilledValues: props.prefilledProps || {},
      deletedValues: [],
      currentValues: {}
    };
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Helpers ----------------------------- //
  // --------------------------------------------------------------------- //

  // return the current schema based on either the schema or collection prop
  getSchema() {
    return this.props.schema ? this.props.schema : Utils.stripTelescopeNamespace(this.props.collection.simpleSchema()._schema);
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
      
      // hide or show the field, a function taking form props as argument & returning a boolean can be used 
      field.hidden = (typeof fieldSchema.hidden === 'function') ? !!fieldSchema.hidden.call(fieldSchema, this.props) : fieldSchema.hidden;

      // add label or internationalized field name if necessary (field not hidden)
      if (!field.hidden) {
        field.label = this.context.intl.formatMessage({id: this.props.collection._name+"."+fieldName, defaultMessage: fieldSchema.label});
      }

      // add value
      field.value = this.getDocument() && deepValue(this.getDocument(), fieldName) ? deepValue(this.getDocument(), fieldName) : "";

      // convert value type if needed
      if (fieldSchema.type.definitions[0].type === Number) field.value = Number(field.value);

      // if value is an array of objects ({_id: '123'}, {_id: 'abc'}), flatten it into an array of strings (['123', 'abc'])
      // fallback to item itself if item._id is not defined (ex: item is not an object or item is just {slug: 'xxx'})
      if (Array.isArray(field.value)) {
        field.value = field.value.map(item => item._id || item);
      }

      // backward compatibility from 'autoform' to 'form'
      if (fieldSchema.autoform) {
        fieldSchema.form = fieldSchema.autoform;
        console.warn(`Vulcan Warning: The 'autoform' field is deprecated. You should rename it to 'form' instead. It was defined on your '${fieldName}' field  on the '${this.props.collection._name}' collection`); // eslint-disable-line
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
        field.options = typeof fieldSchema.form.options === "function" ? fieldSchema.form.options.call(fieldSchema, this.props) : fieldSchema.form.options;
      }

      if (fieldSchema.form && fieldSchema.form.disabled) {
        field.disabled = typeof fieldSchema.form.disabled === "function" ? fieldSchema.form.disabled.call(fieldSchema) : fieldSchema.form.disabled;
      }

      if (fieldSchema.form && fieldSchema.form.help) {
        field.help = typeof fieldSchema.form.help === "function" ? fieldSchema.form.help.call(fieldSchema) : fieldSchema.form.help;
      }

      // add placeholder
      if (fieldSchema.placeholder) {
       field.placeholder = fieldSchema.placeholder;
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

    // remove fields where hidden is set to true
    fields = _.reject(fields, field => field.hidden);
    fields = _.sortBy(fields, "order");

    // get list of all unique groups (based on their name) used in current fields
    let groups = _.compact(_.unique(_.pluck(fields, "group"), false, g => g && g.name));

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
    let relevantFields = this.getFormType() === "edit" ? getEditableFields(this.getSchema(), this.props.currentUser, this.getDocument()) : getInsertableFields(this.getSchema(), this.props.currentUser);

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== "undefined" && fields.length > 0) {
      relevantFields = _.intersection(relevantFields, fields);
    }

    return relevantFields;
  }

  // for each field, we apply the following logic:
  // - if its value is currently being inputted, use that
  // - else if its value is provided by the autofilledValues object, use that
  // - else if its value was provided by the db, use that (i.e. props.document)
  getDocument() {
    const currentDocument = _.clone(this.props.document) || {};
    const document = Object.assign(currentDocument, _.clone(this.state.autofilledValues), _.clone(this.state.currentValues));
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
      this.setState(prevState => ({
        currentValues: e
      }));
    }
  }

  // manually update the current values of one or more fields(i.e. on blur). See above for on change instead
  updateCurrentValues(newValues) {
    // keep the previous ones and extend (with possible replacement) with new ones
    this.setState(prevState => ({
      currentValues: {
        ...prevState.currentValues,
        ...newValues,
      }
    }));
  }

  // key down handler
  formKeyDown(event) {

    if( (event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm(this.refs.form.getModel());
    }
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Errors ------------------------------ //
  // --------------------------------------------------------------------- //

  // clear and re-enable the form
  // by default, clear errors and keep current values
  clearForm({ clearErrors = true, clearCurrentValues = false}) {
    this.setState(prevState => ({
      errors: clearErrors ? [] : prevState.errors,
      currentValues: clearCurrentValues ? {} : prevState.currentValues,
      disabled: false,
    }));
  }

  // render errors
  renderErrors() {
    return <div className="form-errors">{this.state.errors.map((message, index) => <Flash key={index} message={message}/>)}</div>
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Context ----------------------------- //
  // --------------------------------------------------------------------- //

  // add error to form state 
  // from "GraphQL Error: You have an error [error_code]"
  // to { content: "You have an error", type: "error" }
  throwError(errorMessage) {

    let strippedError = errorMessage;
    
    // strip the "GraphQL Error: message [error_code]" given by Apollo if present 
    const graphqlPrefixIsPresent = strippedError.match(/GraphQL error: (.*)/);
    if (graphqlPrefixIsPresent) {
      strippedError = graphqlPrefixIsPresent[1];
    }
    
    // strip the error code if present
    const errorCodeIsPresent = strippedError.match(/(.*)\[(.*)\]/);
    if (errorCodeIsPresent) {
      strippedError = errorCodeIsPresent[1];
    }
    
    // internationalize the error if necessary
    const intlError = Utils.decodeIntlError(strippedError, {stripped: true});
    if(typeof intlError === 'object') {
      const { id, value = "" } = intlError;
      strippedError = this.context.intl.formatMessage({id}, {value});
    }

    // build the error for the Flash component and only keep the interesting message
    const error = {
      content: strippedError,
      type: 'error'
    };
    
    // update the state with unique errors messages
    this.setState(prevState => ({
      errors: _.uniq([...prevState.errors, error])
    }));
  }

  // add something to autofilled values
  addToAutofilledValues(property) {
    this.setState(prevState => ({
      autofilledValues: {
        ...prevState.autofilledValues,
        ...property
      }
    }));
  }

  // add something to deleted values
  addToDeletedValues(name) {
    this.setState(prevState => ({
      deletedValues: [...prevState.deletedValues, name]
    }));
  }

  setFormState(fn) {
    this.setState(fn);
  }

  // pass on context to all child components
  getChildContext() {
    return {
      throwError: this.throwError,
      clearForm: this.clearForm,
      autofilledValues: this.state.autofilledValues,
      addToAutofilledValues: this.addToAutofilledValues,
      addToDeletedValues: this.addToDeletedValues,
      updateCurrentValues: this.updateCurrentValues,
      getDocument: this.getDocument,
      setFormState: this.setFormState,
    };
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Method ------------------------------ //
  // --------------------------------------------------------------------- //

  newMutationSuccessCallback(result) {
    this.mutationSuccessCallback(result, 'new');
  }

  editMutationSuccessCallback(result) {
    this.mutationSuccessCallback(result, 'edit');
  }

  mutationSuccessCallback(result, mutationType) {

    const document = result.data[Object.keys(result.data)[0]]; // document is always on first property

    // for new mutation, run refetch function if it exists
    if (mutationType === 'new' && this.props.refetch) this.props.refetch();

    // call the clear form method (i.e. trigger setState) only if the form has not been unmounted (we are in an async callback, everything can happen!)
    if (typeof this.refs.form !== 'undefined') {
      let clearCurrentValues = false;
      // reset form if this is a new document form
      if (this.props.formType === "new") {
        this.refs.form.reset();
        clearCurrentValues = true;
      }
      this.clearForm({clearErrors: true, clearCurrentValues});
    }

    // run success callback if it exists
    if (this.props.successCallback) this.props.successCallback(document);

  }

  // catch graphql errors
  mutationErrorCallback(error) {

    this.setState(prevState => ({disabled: false}));

    console.log("// graphQL Error"); // eslint-disable-line no-console
    console.log(error); // eslint-disable-line no-console
    
    if (!_.isEmpty(error)) {
      // add error to state
      this.throwError(error.message);
    }

    // note: we don't have access to the document here :( maybe use redux-forms and get it from the store?
    // run error callback if it exists
    // if (this.props.errorCallback) this.props.errorCallback(document, error);
  }

  // submit form handler
  submitForm(data) {
    this.setState(prevState => ({disabled: true}));

    // complete the data with values from custom components which are not being catched by Formsy mixin
    // note: it follows the same logic as SmartForm's getDocument method
    data = {
      ...this.state.autofilledValues, // ex: can be values from NewsletterSubscribe component
      ...data, // original data generated thanks to Formsy
      ...this.state.currentValues, // ex: can be values from DateTime component
    };

    const fields = this.getFieldNames();

    // if there's a submit callback, run it
    if (this.props.submitCallback) {
      data = this.props.submitCallback(data);
    }

    if (this.props.formType === "new") { // new document form

      // remove any empty properties
      let document = _.compactObject(flatten(data));

      // call method with new document
      this.props.newMutation({document}).then(this.newMutationSuccessCallback).catch(this.mutationErrorCallback);

    } else { // edit document form

      const document = this.getDocument();

      // put all keys with data on $set
      const set = _.compactObject(flatten(data));

      // put all keys without data on $unset
      const setKeys = _.keys(set);
      let unsetKeys = _.difference(fields, setKeys);

      // add all keys to delete (minus those that have data associated)
      unsetKeys = _.unique(unsetKeys.concat(_.difference(this.state.deletedValues, setKeys)));

      // build mutation arguments object
      const args = {documentId: document._id, set: set, unset: {}};
      if (unsetKeys.length > 0) {
        args.unset = _.object(unsetKeys, unsetKeys.map(() => true));
      }
      // call method with _id of document being edited and modifier
      this.props.editMutation(args).then(this.editMutationSuccessCallback).catch(this.mutationErrorCallback);
    }

  }

  deleteDocument() {
    const document = this.getDocument();
    const documentId = this.props.document._id;
    const documentTitle = document.title || document.name || '';

    const deleteDocumentConfirm = this.context.intl.formatMessage({id: 'forms.delete_confirm'}, {title: documentTitle});

    if (window.confirm(deleteDocumentConfirm)) {
      this.props.removeMutation({documentId})
        .then((mutationResult) => { // the mutation result looks like {data:{collectionRemove: null}} if succeeded
          if (this.props.removeSuccessCallback) this.props.removeSuccessCallback({documentId, documentTitle});
          if (this.props.refetch) this.props.refetch();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // --------------------------------------------------------------------- //
  // ------------------------- Lifecycle Hooks --------------------------- //
  // --------------------------------------------------------------------- //

  render() {

    const fieldGroups = this.getFieldGroups();
    const collectionName = this.props.collection._name;

    return (
      <div className={"document-"+this.props.formType}>
        <Formsy.Form
          onSubmit={this.submitForm}
          onKeyDown={this.formKeyDown}
          disabled={this.state.disabled}
          ref="form"
        >
          {this.renderErrors()}
          {fieldGroups.map(group => <FormGroup key={group.name} {...group} updateCurrentValues={this.updateCurrentValues} />)}
          <Button type="submit" bsStyle="primary"><FormattedMessage id="forms.submit"/></Button>
          {this.props.cancelCallback ? <a className="form-cancel" onClick={this.props.cancelCallback}><FormattedMessage id="forms.cancel"/></a> : null}
        </Formsy.Form>

        {
          this.props.formType === 'edit' && this.props.showRemove
            ? <div>
                <hr/>
                <a onClick={this.deleteDocument} className={`${collectionName}-delete-link`}>
                  <Components.Icon name="close"/> <FormattedMessage id="forms.delete"/>
                </a>
              </div>
            : null
        }
      </div>
    )
  }


}

Form.propTypes = {

  // main options
  collection: PropTypes.object,
  document: PropTypes.object, // if a document is passed, this will be an edit form
  schema: PropTypes.object, // usually not needed

  // graphQL
  newMutation: PropTypes.func, // the new mutation
  editMutation: PropTypes.func, // the edit mutation
  removeMutation: PropTypes.func, // the remove mutation

  // form
  prefilledProps: PropTypes.object,
  layout: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
  showRemove: PropTypes.bool,

  // callbacks
  submitCallback: PropTypes.func,
  successCallback: PropTypes.func,
  removeSuccessCallback: PropTypes.func,
  errorCallback: PropTypes.func,
  cancelCallback: PropTypes.func,

  currentUser: PropTypes.object,
  client: PropTypes.object,
}

Form.defaultProps = {
  layout: "horizontal",
}

Form.contextTypes = {
  intl: intlShape
}

Form.childContextTypes = {
  autofilledValues: PropTypes.object,
  addToAutofilledValues: PropTypes.func,
  addToDeletedValues: PropTypes.func,
  updateCurrentValues: PropTypes.func,
  setFormState: PropTypes.func,
  throwError: PropTypes.func,
  clearForm: PropTypes.func,
  getDocument: PropTypes.func
}

module.exports = Form
