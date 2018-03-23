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

import { Components, Utils, runCallbacks, getCollection } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import Formsy from 'formsy-react';
import { getEditableFields, getInsertableFields, isEmptyValue } from '../modules/utils.js';
import dot from 'dot-object';
import deepmerge from 'deepmerge';

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
    this.getAutofilledValues = this.getAutofilledValues.bind(this);
    this.addToDeletedValues = this.addToDeletedValues.bind(this);
    this.addToSubmitForm = this.addToSubmitForm.bind(this);
    this.addToSuccessForm = this.addToSuccessForm.bind(this);
    this.addToFailureForm = this.addToFailureForm.bind(this);
    this.throwError = this.throwError.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.formKeyDown = this.formKeyDown.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.getDocument = this.getDocument.bind(this);
    // a debounced version of seState that only updates state every 500 ms (not used)
    this.debouncedSetState = _.debounce(this.setState, 500);
    this.setFormState = this.setFormState.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.getErrorMessage = this.getErrorMessage.bind(this);
    // version of submitForm that is made available to context, behaves like updateCurrentValues but submits afterwards
    this.submitFormContext = this.submitFormContext.bind(this);
    this.getCollection = this.getCollection.bind(this);

    this.state = {
      disabled: false,
      errors: [],
      autofilledValues: {},
      deletedValues: [],
      currentValues: {}
    };

    this.submitFormCallbacks = [];
    this.successFormCallbacks = [];
    this.failureFormCallbacks = [];
  }
  
  // --------------------------------------------------------------------- //
  // ------------------------------- Helpers ----------------------------- //
  // --------------------------------------------------------------------- //

  fieldSchemas = {}
  
  getCollection() {
    return this.props.collection || getCollection(this.props.collectionName);
  }

  // return the current schema based on either the schema or collection prop
  getSchema() {
    return this.props.schema ? this.props.schema : this.getCollection().simpleSchema()._schema;
  }

  getValue = (fieldName, document) => {
    // console.log('getValue')
    // console.log(fieldName)
    // console.log(document)
    if (typeof document[fieldName] !== 'undefined' && document[fieldName] !== null) {
      return document[fieldName];
    }
    return null;
  }  
  
  createField = (fieldName, fieldSchema, document, parentFieldName) => {

    // console.log('// createField')
    // console.log(fieldName)
    // console.log(fieldSchema)
    // console.log(document)

    // store fieldSchema object in this.fieldSchemas
    this.fieldSchemas[fieldName] = fieldSchema;

    fieldSchema.name = fieldName;

    // intialize properties
    let field = {
      name: fieldName,
      datatype: fieldSchema.type,
      control: fieldSchema.control,
      layout: this.props.layout,
      order: fieldSchema.order
    }

    // if field has a parent field and index, pass them on
    if (parentFieldName) {
      field.parentFieldName = parentFieldName;
    }

    // nested fields: set control to "nested"
    if (fieldSchema.type.singleType === Array) {
      field.control = 'nested';
      field.nestedSchema = this.getSchema()[`${fieldName}.$`].type.definitions[0].type._schema; // TODO: do this better
      field.nestedFields = this.getFieldNames(field.nestedSchema).map((subFieldName, index) => {

        const subFieldSchema = field.nestedSchema[subFieldName];
        const subDocument = document[fieldName][index][subFieldName];
        
        return this.createField(subFieldName, subFieldSchema, subDocument, fieldName);
      })
      
    }
    
    field.label = this.getLabel(fieldName);

    const fieldValue = this.getValue(fieldName, document);

    // add value
    if (fieldValue){

      field.value = fieldValue;

      // convert value type if needed
      if (fieldSchema.type.definitions[0].type === Number) field.value = Number(field.value);

      // if value is an array of objects ({_id: '123'}, {_id: 'abc'}), flatten it into an array of strings (['123', 'abc'])
      // fallback to item itself if item._id is not defined (ex: item is not an object or item is just {slug: 'xxx'})
      if (Array.isArray(field.value)) {
        field.value = field.value.map(item => item._id || item);
      }

    }

    // backward compatibility from 'autoform' to 'form'
    if (fieldSchema.autoform) {
      fieldSchema.form = fieldSchema.autoform;
      console.warn(`Vulcan Warning: The 'autoform' field is deprecated. You should rename it to 'form' instead. It was defined on your '${fieldName}' field  on the '${this.getCollection()._name}' collection`); // eslint-disable-line
    }

    // replace value by prefilled value if value is empty
    const prefill = fieldSchema.prefill || fieldSchema.form && fieldSchema.form.prefill;
    if (prefill) {
      const prefilledValue = typeof prefill === "function" ? prefill.call(fieldSchema) : prefill;
      if (!!prefilledValue && !field.value) {
        field.prefilledValue = prefilledValue;
        field.value = prefilledValue;
      }
    }

    // add options if they exist
    const fieldOptions = fieldSchema.options || fieldSchema.form && fieldSchema.form.options;
    if (fieldOptions) {
      field.options = typeof fieldOptions === "function" ? fieldOptions.call(fieldSchema, this.props) : fieldOptions;

      // in case of checkbox groups, check "checked" option to populate value if this is a "new document" form
      const checkedValues = _.where(field.options, {checked: true}).map(option => option.value);
      if (checkedValues.length && !field.value && this.getFormType() === 'new') {
        field.value = checkedValues
      }
    }

    // replace empty value, which has not been prefilled, by the default value from the schema
    // keep defaultValue for backwards compatibility even though it doesn't actually work
    if (isEmptyValue(field.value)) {
      if (fieldSchema.defaultValue) field.value = fieldSchema.defaultValue;
      if (fieldSchema.default) field.value = fieldSchema.default;
    }

    // add any properties specified in fieldProperties or form as extra props passed on
    // to the form component
    const fieldProperties = fieldSchema.fieldProperties || fieldSchema.form;
    if (fieldProperties) {
      for (const prop in fieldProperties) {
        if (prop !== 'prefill' && prop !== 'options' && fieldProperties.hasOwnProperty(prop)) {
          field[prop] = typeof fieldProperties[prop] === "function" ?
          fieldProperties[prop].call(fieldSchema) :
          fieldProperties[prop];
        }
      }
    }

    // add limit
    if (fieldSchema.limit) {
     field.limit = fieldSchema.limit;
    }

    // add description as help prop
    if (fieldSchema.description) {
      field.help = fieldSchema.description;
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

    // add error state
    const validationError = _.findWhere(this.state.errors, {name: 'app.validation_error'});
    if (validationError) {
      const fieldErrors = _.filter(validationError.data.errors, error => error.data.fieldName === fieldName);
      if (fieldErrors) {
        field.errors = fieldErrors.map(error => ({...error, message: this.getErrorMessage(error)}));
      }
    }

    return field;

  }

  getFieldGroups() {

    const schema = this.getSchema();
    const document = this.getDocument();
    
    // build fields array by iterating over the list of field names
    let fields = this.getFieldNames(schema).map(fieldName => {
      

      // get schema for the current field
      const fieldSchema = schema[fieldName];
      return this.createField(fieldName, fieldSchema, document)
    });

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
  getFieldNames(schema) {
    
    const { fields, hideFields } = this.props;

    // get all editable/insertable fields (depending on current form type)
    let relevantFields = this.getFormType() === "edit" ? getEditableFields(schema, this.props.currentUser, this.getDocument()) : getInsertableFields(schema, this.props.currentUser);

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== "undefined" && fields.length > 0) {
      relevantFields = _.intersection(relevantFields, fields);
    } else {
      // else if fields is not specified, remove all hidden fields
      relevantFields = _.reject(relevantFields, fieldName => {
        const hidden = schema[fieldName].hidden;
        return typeof hidden === 'function' ? hidden(this.props) : hidden;
      });
    }

    // if "hideFields" prop is specified, remove its fields
    if (typeof hideFields !== "undefined" && hideFields.length > 0) {
      relevantFields = _.difference(relevantFields, hideFields);
    }

    return relevantFields;
  }

  // for each field, we apply the following logic:
  // - if its value is currently being inputted, use that
  // - else if its value is provided by the autofilledValues object, use that
  // - else if its value was provided by the db, use that (i.e. props.document)
  // - else if its value was provided by prefilledProps, use that
  // - finally, remove all values that should be deleted
  getDocument() {
    const currentDocument = _.clone(this.props.document) || {};
    // const document = Object.assign(_.clone(this.props.prefilledProps || {}), currentDocument, _.clone(this.state.autofilledValues), _.clone(this.state.currentValues));
    let document = deepmerge.all([
      this.props.prefilledProps, 
      currentDocument, 
      this.state.autofilledValues, 
      this.state.currentValues
    ]);

    return document;
  }

  // like getDocument, but cross-reference with getFieldNames() to only return fields that actually need to be submitted
  getData() {
    // only keep relevant fields
    // run data object through submitForm callbacks
    const fields = this.getFieldNames(this.getSchema());
    let data = _.pick(this.getDocument(), ...fields);
    data = runCallbacks(this.submitFormCallbacks, data);
    return data;
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
  updateCurrentValues = newValues => {
    // keep the previous ones and extend (with possible replacement) with new ones
    this.setState(prevState => {
      // const newState = _.clone(prevState)
      Object.keys(newValues).forEach(key => {
        const path = key;
        const value = newValues[key];
        if (value === null) {
          // delete value
          // dot.str(path, prevState.currentValues, true);
          console.log(`deleting! ${path}`)
          this.addToDeletedValues(path);
        } else {
          dot.str(path, value, prevState.currentValues);
        }
      });
      return prevState
    });
  }

  // key down handler
  formKeyDown(event) {
    if( (event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm(this.refs.form.getModel());
    }
  }

  getLabel(fieldName) {
    return this.context.intl.formatMessage({id: this.getCollection()._name+"."+fieldName, defaultMessage: this.fieldSchemas[fieldName].label});
  }

  getErrorMessage(error) {
    if (error.data.fieldName) {
      // if error has a corresponding field name, "labelify" that field name
      const fieldName = this.getLabel(error.data.fieldName);
      return this.context.intl.formatMessage({id: error.id, defaultMessage: error.id}, {...error.data, fieldName});
    } else {
      return this.context.intl.formatMessage({id: error.id, defaultMessage: error.id}, error.data);
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

    return (
      <div className="form-errors">
        {this.state.errors.map((error, index) => {

          let message;

          if (error.data && error.data.errors) { // this error is a "multi-error" with multiple sub-errors

            message = error.data.errors.map(error => {
              return {
                content: this.getErrorMessage(error),
                data: error.data,
              }
            });

          } else { // this is a regular error

            message = {content: error.message || this.context.intl.formatMessage({id: error.id, defaultMessage: error.id}, error.data)}

          }

          return <Components.FormFlash key={index} message={message} type="error"/>;
        })}
      </div>
    )
  }

  // --------------------------------------------------------------------- //
  // ------------------------------- Context ----------------------------- //
  // --------------------------------------------------------------------- //

  // add error to form state
  // from "GraphQL Error: You have an error [error_code]"
  // to { content: "You have an error", type: "error" }
  throwError(error) {

    // get graphQL error (see https://github.com/thebigredgeek/apollo-errors/issues/12)
    const graphQLError = error.graphQLErrors[0];
    // eslint-disable-next-line no-console
    console.log(graphQLError);

    // add error to state
    this.setState(prevState => ({
      errors: [...prevState.errors, graphQLError]
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

  // get autofilled values
  getAutofilledValues() {
    return this.state.autofilledValues;
  }

  // add something to deleted values
  addToDeletedValues(name) {
    this.setState(prevState => ({
      deletedValues: [...prevState.deletedValues, name]
    }));
  }

  // add a callback to the form submission
  addToSubmitForm(callback) {
    this.submitFormCallbacks.push(callback);
  }

  // add a callback to form submission success
  addToSuccessForm(callback) {
    this.successFormCallbacks.push(callback);
  }

  // add a callback to form submission failure
  addToFailureForm(callback) {
    this.failureFormCallbacks.push(callback);
  }

  setFormState(fn) {
    this.setState(fn);
  }

  submitFormContext(newValues) {
    // keep the previous ones and extend (with possible replacement) with new ones
    this.setState(prevState => ({
      currentValues: {
        ...prevState.currentValues,
        ...newValues,
      } // Submit form after setState update completed
    }), () => this.submitForm(this.refs.form.getModel()));
  }

  // pass on context to all child components
  getChildContext() {
    return {
      throwError: this.throwError,
      clearForm: this.clearForm,
      submitForm: this.submitFormContext, //Change in name because we already have a function called submitForm, but no reason for the user to know about that
      getAutofilledValues: this.getAutofilledValues,
      addToAutofilledValues: this.addToAutofilledValues,
      addToDeletedValues: this.addToDeletedValues,
      updateCurrentValues: this.updateCurrentValues,
      getDocument: this.getDocument,
      setFormState: this.setFormState,
      addToSubmitForm: this.addToSubmitForm,
      addToSuccessForm: this.addToSuccessForm,
      addToFailureForm: this.addToFailureForm,
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
      if (this.getFormType() === "new") {
        this.refs.form.reset();
        clearCurrentValues = true;
      }
      this.clearForm({clearErrors: true, clearCurrentValues});
    }

    // run document through mutation success callbacks
    result = runCallbacks(this.successFormCallbacks, result);

    // run success callback if it exists
    if (this.props.successCallback) this.props.successCallback(document);

  }

  // catch graphql errors
  mutationErrorCallback(error) {

    this.setState(prevState => ({disabled: false}));

    // eslint-disable-next-line no-console
    console.log("// graphQL Error");
    // eslint-disable-next-line no-console
    console.log(error);

    // run mutation failure callbacks on error, we do not allow the callbacks to change the error
    runCallbacks(this.failureFormCallbacks, error);

    if (!_.isEmpty(error)) {
      // add error to state
      this.throwError(error);
    }

    // note: we don't have access to the document here :( maybe use redux-forms and get it from the store?
    // run error callback if it exists
    // if (this.props.errorCallback) this.props.errorCallback(document, error);
  }

  // submit form handler
  submitForm(data) {

    // note: we can discard the data collected by Formsy because all the data we need is already available via getDocument()

    // if form is disabled (there is already a submit handler running) don't do anything
    if (this.state.disabled) {
      return;
    }

    // clear errors and disable form while it's submitting
    this.setState(prevState => ({errors: [], disabled: true}));
    console.log(data)
    console.log(this.getDocument())

    // complete the data with values from custom components which are not being catched by Formsy mixin
    // note: it follows the same logic as SmartForm's getDocument method
    // data = deepmerge(this.getDocument(), data);
    data = this.getData();

    // console.log(data)

    const fields = this.getFieldNames(this.getSchema());

    // if there's a submit callback, run it
    if (this.props.submitCallback) {
      data = this.props.submitCallback(data);
    }

    if (this.getFormType() === "new") { // new document form

      // remove any empty properties
      let document = _.compactObject(data);
      // call method with new document
      this.props.newMutation({document}).then(this.newMutationSuccessCallback).catch(this.mutationErrorCallback);

    } else { // edit document form

      const document = this.getDocument();

      // put all keys with data on $set
      const set = _.compactObject(data);

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
          // eslint-disable-next-line no-console
          console.log(error);
        });
    }
  }

  // --------------------------------------------------------------------- //
  // ------------------------- Lifecycle Hooks --------------------------- //
  // --------------------------------------------------------------------- //

  render() {

    const fieldGroups = this.getFieldGroups();
    const collectionName = this.getCollection()._name;

    return (
      <div className={"document-"+this.getFormType()}>
        <Formsy.Form
          onSubmit={this.submitForm}
          onKeyDown={this.formKeyDown}
          disabled={this.state.disabled}
          ref="form"
        >

          {this.renderErrors()}

          {fieldGroups.map(group => <Components.FormGroup key={group.name} {...group} updateCurrentValues={this.updateCurrentValues} />)}

          {this.props.repeatErrors && this.renderErrors()}

          <Components.FormSubmit submitLabel={this.props.submitLabel}
                                 cancelLabel={this.props.cancelLabel}
                                 cancelCallback={this.props.cancelCallback}
                                 document={this.getDocument()}
                                 deleteDocument={(this.getFormType() === 'edit'
                                   && this.props.showRemove
                                   && this.deleteDocument)
                                 || null}
                                 collectionName={collectionName}
          />

        </Formsy.Form>
      </div>
    )
  }


}

Form.propTypes = {

  // main options
  collection: PropTypes.object,
  collectionName: (props, propName, componentName) => {
    if (!props.collection && !props.collectionName) {
      return new Error(`One of props 'collection' or 'collectionName' was not specified in '${componentName}'.`);
    }
    if (!props.collection && typeof props['collectionName'] !== 'string') {
      return new Error(`Prop collectionName was not of type string in '${componentName}`);
    }
  },
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
  hideFields: PropTypes.arrayOf(PropTypes.string),
  showRemove: PropTypes.bool,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  repeatErrors: PropTypes.bool,

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
  layout: 'horizontal',
  prefilledProps: {},
  repeatErrors: false,
  showRemove: true,
}

Form.contextTypes = {
  intl: intlShape
}

Form.childContextTypes = {
  getAutofilledValues: PropTypes.func,
  addToAutofilledValues: PropTypes.func,
  addToDeletedValues: PropTypes.func,
  addToSubmitForm: PropTypes.func,
  addToFailureForm: PropTypes.func,
  addToSuccessForm: PropTypes.func,
  updateCurrentValues: PropTypes.func,
  setFormState: PropTypes.func,
  throwError: PropTypes.func,
  clearForm: PropTypes.func,
  getDocument: PropTypes.func,
  submitForm: PropTypes.func,
}

module.exports = Form
