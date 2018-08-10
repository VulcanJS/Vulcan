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

import {
  registerComponent,
  Components,
  runCallbacks,
  getCollection,
  getErrors,
  getSetting,
  Utils,
  isIntlField,
} from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import Formsy from 'formsy-react';
import { getEditableFields, getInsertableFields } from '../modules/utils.js';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';
import compact from 'lodash/compact';
import update from 'lodash/update';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import find from 'lodash/find';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import isObject from 'lodash/isObject';

import { convertSchema, formProperties } from '../modules/schema_utils';
import { isEmptyValue } from '../modules/utils';
import { getParentPath } from '../modules/path_utils';

// unsetCompact
const unsetCompact = (object, path) => {
  unset(object, path);
  compactParent(object, path);
};

const compactParent = (object, path) => {
  const parentPath = getParentPath(path);

  // note: we only want to compact arrays, not objects
  const compactIfArray = x => Array.isArray(x) ? compact(x) : x;

  update(object, parentPath, compactIfArray);
};

const getInitialStateFromProps = (nextProps) => {
  const collection = nextProps.collection || getCollection(nextProps.collectionName);
  const schema = collection.simpleSchema();
  // we need to clone object passed from props otherwise they'll be immutable
  const initialDocument = merge({}, nextProps.prefilledProps, nextProps.document);
  return {
    disabled: false,
    errors: [],
    deletedValues: [],
    currentValues: {},
    // convert SimpleSchema schema into JSON object
    schema: convertSchema(schema),
    // Also store all field schemas (including nested schemas) in a flat structure
    flatSchema: convertSchema(schema, true),
    // the initial document passed as props
    initialDocument,
    // initialize the current document to be the same as the initial document
    currentDocument: initialDocument,
  };
};

/*

1. Constructor
2. Helpers
3. Errors
4. Context
4. Method & Callback
5. Render

*/

class SmartForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...getInitialStateFromProps(props),
    };
  }

  defaultValues = {};

  submitFormCallbacks = [];
  successFormCallbacks = [];
  failureFormCallbacks = [];

  // --------------------------------------------------------------------- //
  // ------------------------------- Helpers ----------------------------- //
  // --------------------------------------------------------------------- //

  /*

  Get the current collection

  */
  getCollection = () => {
    return this.props.collection || getCollection(this.props.collectionName);
  };

  /*

  Get current typeName

  */
  getTypeName = () => {
    return this.getCollection().options.typeName;
  }

  /*

  If a document is being passed, this is an edit form

  */
  getFormType = () => {
    return this.props.document ? 'edit' : 'new';
  };

  /*

  Get a list of all insertable fields

  */
  getInsertableFields = (schema) => {
    return getInsertableFields(schema || this.state.schema, this.props.currentUser);
  }

  /*

  Get a list of all editable fields
  
  */
  getEditableFields = (schema) => {
    return getEditableFields(schema || this.state.schema, this.props.currentUser, this.state.initialDocument)
  }

  /*

  Get a list of all mutable (insertable/editable depending on current form type) fields

  */
  getMutableFields = (schema) => {
    return this.getFormType() === 'edit' ? this.getEditableFields(schema) : this.getInsertableFields(schema);
  }

  /*

  Get the current document

  */
  getDocument = () => {
    return this.state.currentDocument;
  };

  /*

  Like getDocument, but cross-reference with getFieldNames()
  to only return fields that actually need to be submitted

  Also remove any deleted values.

  */
  getData = (customArgs) => {

    const args = { excludeHiddenFields: false, replaceIntlFields: true, addExtraFields: false, ...customArgs };

    // only keep relevant fields
    // for intl fields, make sure we look in foo_intl and not foo
    const fields = this.getFieldNames(args);
    let data = pick(this.getDocument(), ...fields);

    // compact deleted values
    this.state.deletedValues.forEach(path => {
      if (path.includes('.')) {
        /*
        
        If deleted field is a nested field, nested array, or nested array item, try to compact its parent array
        
        - Nested field: 'address.city'
        - Nested array: 'addresses.1'
        - Nested array item: 'addresses.1.city'

        */
       compactParent(data, path);
      }
    });

    // run data object through submitForm callbacks
    data = runCallbacks(this.submitFormCallbacks, data);

    return data;
  };
  // --------------------------------------------------------------------- //
  // -------------------------------- Fields ----------------------------- //
  // --------------------------------------------------------------------- //

  /*

  Get all field groups

  */
  getFieldGroups = () => {
    // build fields array by iterating over the list of field names
    let fields = this.getFieldNames().map(fieldName => {
      // get schema for the current field
      return this.createField(fieldName, this.state.schema);
    });

    fields = _.sortBy(fields, 'order');

    // get list of all unique groups (based on their name) used in current fields
    let groups = _.compact(uniqBy(_.pluck(fields, 'group'), g => g && g.name));

    // for each group, add relevant fields
    groups = groups.map(group => {
      group.label = group.label || this.context.intl.formatMessage({ id: group.name });
      group.fields = _.filter(fields, field => {
        return field.group && field.group.name === group.name;
      });
      return group;
    });

    // add default group
    groups = [
      {
        name: 'default',
        label: 'default',
        order: 0,
        fields: _.filter(fields, field => {
          return !field.group;
        }),
      },
    ].concat(groups);

    // sort by order
    groups = _.sortBy(groups, 'order');

    // console.log(groups);

    return groups;
  };

  /*

  Get a list of the fields to be included in the current form

  Note: when submitting the form (getData()), do not include any extra fields.

  */
  getFieldNames = (args = {}) => {

    const { schema = this.state.schema, excludeHiddenFields = true, replaceIntlFields = false, addExtraFields = true } = args;

    const { fields, addFields, } = this.props;

    // get all editable/insertable fields (depending on current form type)
    let relevantFields = this.getMutableFields(schema);

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== 'undefined' && fields.length > 0) {
      relevantFields = _.intersection(relevantFields, fields);
    }

    // if "removeFields" prop is specified, remove its fields
    const removeFields = this.props.hideFields || this.props.removeFields;
    if (typeof removeFields !== 'undefined' && removeFields.length > 0) {
      relevantFields = _.difference(relevantFields, removeFields);
    }

    // if "addFields" prop is specified, add its fields
    if (addExtraFields && typeof addFields !== 'undefined' && addFields.length > 0) {
      relevantFields = relevantFields.concat(addFields);
    }

    // remove all hidden fields
    if (excludeHiddenFields) {
      const document = this.getDocument();
      relevantFields = _.reject(relevantFields, fieldName => {
        const hidden = schema[fieldName].hidden;
        return typeof hidden === 'function' ? hidden({ ...this.props, document }) : hidden;
      });
    }

    // replace intl fields
    if (replaceIntlFields) {
      relevantFields = relevantFields.map(fieldName => isIntlField(schema[fieldName]) ? `${fieldName}_intl` : fieldName);
    }

    // remove any duplicates
    relevantFields = uniq(relevantFields);

    return relevantFields;
  };

  /*
  Given a field's name, the containing schema, and parent, create the
  complete field object to be passed to the component

  */
  createField = (fieldName, schema, parentFieldName, parentPath) => {
    const fieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    const fieldSchema = schema[fieldName];

    // intialize properties
    let field = {
      ..._.pick(fieldSchema, formProperties),
      document: this.state.initialDocument,
      name: fieldName,
      path: fieldPath,
      datatype: fieldSchema.type,
      layout: this.props.layout,
      input: fieldSchema.input || fieldSchema.control,
    };

    // if this an intl'd field, use a special intlInput
    if (isIntlField(fieldSchema)) {
      field.intlInput = true;
    }

    if (field.defaultValue) {
      set(this.defaultValues, fieldPath, field.defaultValue);
    }

    // if field has a parent field, pass it on
    if (parentFieldName) {
      field.parentFieldName = parentFieldName;
    }

    field.label = this.getLabel(fieldName);

    // // replace value by prefilled value if value is empty
    // const prefill = fieldSchema.prefill || (fieldSchema.form && fieldSchema.form.prefill);
    // if (prefill) {
    //   const prefilledValue = typeof prefill === 'function' ? prefill.call(fieldSchema) : prefill;
    //   if (!!prefilledValue && !field.value) {
    //     field.prefilledValue = prefilledValue;
    //     field.value = prefilledValue;
    //   }
    // }

    // if options are a function, call it
    if (typeof field.options === 'function') {
      field.options = field.options.call(fieldSchema, this.props);
    }

    // add any properties specified in fieldSchema.form as extra props passed on
    // to the form component, calling them if they are functions
    const inputProperties = fieldSchema.form || fieldSchema.inputProperties || {};
    for (const prop in inputProperties) {
      const property = inputProperties[prop];
      field[prop] = typeof property === 'function' ? property.call(fieldSchema, this.props) : property;
    }

    // if field is not creatable/updatable, disable it
    if (!this.getMutableFields(schema).includes(fieldName)) {
      field.disabled = true;
    }

    // add description as help prop
    if (fieldSchema.description) {
      field.help = fieldSchema.description;
    }

    // nested fields: set input to "nested"
    if (fieldSchema.schema) {
      field.nestedSchema = fieldSchema.schema;
      field.nestedInput = true;

      // get nested schema
      // for each nested field, get field object by calling createField recursively
      field.nestedFields = this.getFieldNames({ schema: field.nestedSchema }).map(subFieldName => {
        return this.createField(subFieldName, field.nestedSchema, fieldName, fieldPath);
      });
    }

    return field;
  };

  /*

   Get a field's label

   */
  getLabel = (fieldName, fieldLocale) => {
    const collectionName = this.getCollection().options.collectionName.toLowerCase();
    const intlLabel = this.context.intl.formatMessage({ id: `${collectionName}.${fieldName}` });
    const schemaLabel = this.state.flatSchema[fieldName] && this.state.flatSchema[fieldName].label;
    const label = intlLabel || schemaLabel || fieldName;
    if (fieldLocale) {
      const intlFieldLocale = this.context.intl.formatMessage({ id: `locales.${fieldLocale}`, defaultMessage: fieldLocale });
      return `${label} (${intlFieldLocale})`;
    } else {
      return label;
    }
  };

  // --------------------------------------------------------------------- //
  // ------------------------------- Errors ------------------------------ //
  // --------------------------------------------------------------------- //

  /*

  Add error to form state

  Errors can have the following properties:
    - id: used as an internationalization key, for example `errors.required`
    - path: for field-specific errors, the path of the field with the issue
    - properties: additional data. Will be passed to vulcan-i18n as values
    - message: if id cannot be used as i81n key, message will be used
    
  */
  throwError = error => {
    let formErrors = getErrors(error);

    // eslint-disable-next-line no-console
    console.log(formErrors);

    // add error(s) to state
    this.setState(prevState => ({
      errors: [...prevState.errors, ...formErrors],
    }));
  };

  /*

  Clear errors for a field

  */
  clearFieldErrors = path => {
    const errors = this.state.errors.filter(error => error.path !== path);
    this.setState({ errors });
  };

  // --------------------------------------------------------------------- //
  // ------------------------------- Context ----------------------------- //
  // --------------------------------------------------------------------- //

  // add something to deleted values
  addToDeletedValues = name => {
    this.setState(prevState => ({
      deletedValues: [...prevState.deletedValues, name],
    }));
  };

  // add a callback to the form submission
  addToSubmitForm = callback => {
    this.submitFormCallbacks.push(callback);
  };

  // add a callback to form submission success
  addToSuccessForm = callback => {
    this.successFormCallbacks.push(callback);
  };

  // add a callback to form submission failure
  addToFailureForm = callback => {
    this.failureFormCallbacks.push(callback);
  };

  setFormState = fn => {
    this.setState(fn);
  };

  submitFormContext = newValues => {
    // keep the previous ones and extend (with possible replacement) with new ones
    this.setState(
      prevState => ({
        currentValues: {
          ...prevState.currentValues,
          ...newValues,
        }, // Submit form after setState update completed
      }),
      () => this.submitForm(this.form.getModel())
    );
  };

  // pass on context to all child components
  getChildContext = () => {
    return {
      throwError: this.throwError,
      clearForm: this.clearForm,
      refetchForm: this.refetchForm,
      isChanged: this.isChanged,
      submitForm: this.submitFormContext, //Change in name because we already have a function
      // called submitForm, but no reason for the user to know
      // about that
      addToDeletedValues: this.addToDeletedValues,
      updateCurrentValues: this.updateCurrentValues,
      getDocument: this.getDocument,
      getLabel: this.getLabel,
      initialDocument: this.state.initialDocument,
      setFormState: this.setFormState,
      addToSubmitForm: this.addToSubmitForm,
      addToSuccessForm: this.addToSuccessForm,
      addToFailureForm: this.addToFailureForm,
      errors: this.state.errors,
      currentValues: this.state.currentValues,
      deletedValues: this.state.deletedValues,
    };
  };

  // --------------------------------------------------------------------- //
  // ------------------------------ Lifecycle ---------------------------- //
  // --------------------------------------------------------------------- //

  /*

  When props change, reinitialize state

  // TODO: only need to check nextProps.prefilledProps?
  // TODO: see https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
  
  */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props, nextProps)) {
      this.setState(getInitialStateFromProps(nextProps));
    }
  }

  /*
  
  Manually update the current values of one or more fields(i.e. on change or blur).
  
  */
  updateCurrentValues = (newValues, options = {}) => {

    // default to overwriting old value with new
    const { mode = 'overwrite' } = options;
    
    // keep the previous ones and extend (with possible replacement) with new ones
    this.setState(prevState => {
      
      // keep only the relevant properties
      const { currentValues, currentDocument, deletedValues } = cloneDeep(prevState);
      const newState = { currentValues, currentDocument, deletedValues, foo: {} };

      Object.keys(newValues).forEach(key => {
        const path = key;
        const value = newValues[key];
        if (isEmptyValue(value)) {
          // delete value
          unset(newState.currentValues, path);
          set(newState.currentDocument, path, null);
          newState.deletedValues = [...prevState.deletedValues, path];
        } else {
          // 1. update currentValues
          set(newState.currentValues, path, value);

          // 2. update currentDocument
          // For arrays and objects, give option to merge instead of overwrite
          if (mode === 'merge' && (Array.isArray(value) || isObject(value))) {
            const oldValue = get(newState.currentDocument, path);
            set(newState.currentDocument, path, merge(oldValue, value));
          } else {
            set(newState.currentDocument, path, value);
          }

          // 3. in case value had previously been deleted, "undelete" it
          newState.deletedValues = _.without(prevState.deletedValues, path);
        }
      });
      return newState;
    });
  };

  /*
  
  Warn the user if there are unsaved changes
  
  */
  handleRouteLeave = () => {
    if (this.isChanged()) {
      const message = this.context.intl.formatMessage({
        id: 'forms.confirm_discard',
        defaultMessage: 'Are you sure you want to discard your changes?',
      });
      return message;
    }
  };

  //see https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
  //the message returned is actually ignored by most browsers and a default message 'Are you sure you want to leave this page? You might have unsaved changes' is displayed. See the Notes section on the mozilla docs above
  handlePageLeave = (event) => {
    if (this.isChanged()) {
      const message = this.context.intl.formatMessage({
        id: 'forms.confirm_discard',
        defaultMessage: 'Are you sure you want to discard your changes?'
      });
      if (event) {
        event.returnValue = message;
      }

      return message;
    }
  };

  /*
  
  Install a route leave hook to warn the user if there are unsaved changes
  
  */
  componentDidMount = () => {
    let warnUnsavedChanges = getSetting('forms.warnUnsavedChanges');
    if (typeof this.props.warnUnsavedChanges === 'boolean') {
      warnUnsavedChanges = this.props.warnUnsavedChanges;
    }
    if (warnUnsavedChanges) {
      const routes = this.props.router.routes;
      const currentRoute = routes[routes.length - 1];
      this.props.router.setRouteLeaveHook(currentRoute, this.handleRouteLeave);

      //check for closing the browser with unsaved changes
      window.onbeforeunload = this.handlePageLeave;
    }
  };

  /*
  Remove the closing browser check on component unmount
  see https://gist.github.com/mknabe/bfcb6db12ef52323954a28655801792d
  */
  componentWillUnmount = () => {
    let warnUnsavedChanges = getSetting('forms.warnUnsavedChanges');
    if (typeof this.props.warnUnsavedChanges === 'boolean') {
      warnUnsavedChanges = this.props.warnUnsavedChanges;
    }
    if (warnUnsavedChanges) {
      window.onbeforeunload = undefined; //undefined instead of null to support IE
    }
  };

  /*
  
  Returns true if there are any differences between the initial document and the current one
  
  */
  isChanged = () => {
    const initialDocument = this.state.initialDocument;
    const changedDocument = this.getDocument();

    const changedValue = find(changedDocument, (value, key, collection) => {
      return !isEqualWith(value, initialDocument[key], (objValue, othValue) => {
        if (!objValue && !othValue) return true;
      });
    });

    return typeof changedValue !== 'undefined';
  };

  /*
  
  Refetch the document from the database (in case it was updated by another process or to reset the form)
  
  */
  refetchForm = () => {
    if (this.props.data && this.props.data.refetch) {
      this.props.data.refetch();
    }
  };

  /*
  
  Clear and reset the form
  By default, clear errors and keep current values and deleted values

  On form success we'll clear current values too. Note: document includes currentValues

  */
  clearForm = ({ clearErrors = true, clearCurrentValues = false, clearDeletedValues = false, document }) => {
    document = document ? merge({}, this.props.prefilledProps, document) : null;

    this.setState(prevState => ({
      errors: clearErrors ? [] : prevState.errors,
      currentValues: clearCurrentValues ? {} : prevState.currentValues,
      deletedValues: clearDeletedValues ? [] : prevState.deletedValues,
      initialDocument: document && !clearCurrentValues ? document : prevState.initialDocument,
      disabled: false,
    }));
  };

  /*

  Key down handler

  */
  formKeyDown = event => {
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm(this.form.getModel());
    }
  };

  newMutationSuccessCallback = result => {
    this.mutationSuccessCallback(result, 'new');
  };

  editMutationSuccessCallback = result => {
    this.mutationSuccessCallback(result, 'edit');
  };

  mutationSuccessCallback = (result, mutationType) => {

    this.setState(prevState => ({ disabled: false }));
    const document = result.data[Object.keys(result.data)[0]].data; // document is always on first property

    // for new mutation, run refetch function if it exists
    if (mutationType === 'new' && this.props.refetch) this.props.refetch();

    // call the clear form method (i.e. trigger setState) only if the form has not been unmounted
    // (we are in an async callback, everything can happen!)
    if (this.form) {
      this.form.reset(this.getDocument());
      this.clearForm({ clearErrors: true, clearCurrentValues: true, clearDeletedValues: true, document });
    }

    // run document through mutation success callbacks
    result = runCallbacks(this.successFormCallbacks, result);

    // run success callback if it exists
    if (this.props.successCallback) this.props.successCallback(document);
  };

  // catch graphql errors
  mutationErrorCallback = (document, error) => {
    this.setState(prevState => ({ disabled: false }));

    // eslint-disable-next-line no-console
    console.log('// graphQL Error');
    // eslint-disable-next-line no-console
    console.log(error);

    // run mutation failure callbacks on error, we do not allow the callbacks to change the error
    runCallbacks(this.failureFormCallbacks, error);

    if (!_.isEmpty(error)) {
      // add error to state
      this.throwError(error);
    }

    // run error callback if it exists
    if (this.props.errorCallback) this.props.errorCallback(document, error);

    // scroll back up to show error messages
    Utils.scrollIntoView('.flash-message');
  };

  /*

  Submit form handler

  */
  submitForm = data => {
    // note: we can discard the data collected by Formsy because all the data we need is already available via getDocument()

    // if form is disabled (there is already a submit handler running) don't do anything
    if (this.state.disabled) {
      return;
    }

    // clear errors and disable form while it's submitting
    this.setState(prevState => ({ errors: [], disabled: true }));

    // complete the data with values from custom components which are not being catched by Formsy mixin
    // note: it follows the same logic as SmartForm's getDocument method
    data = this.getData({ replaceIntlFields: true, addExtraFields: false });

    // if there's a submit callback, run it
    if (this.props.submitCallback) {
      data = this.props.submitCallback(data);
    }

    if (this.getFormType() === 'new') {
      // create document form
      this.props[`create${this.getTypeName()}`]({ data })
        .then(this.newMutationSuccessCallback)
        .catch(error => this.mutationErrorCallback(document, error));
    } else {
      // update document form
      const documentId = this.getDocument()._id;
      this.props[`update${this.getTypeName()}`]({ selector: { documentId }, data })
        .then(this.editMutationSuccessCallback)
        .catch(error => this.mutationErrorCallback(document, error));
    }
  };

  /*

  Delete document handler

  */
  deleteDocument = () => {
    const document = this.getDocument();
    const documentId = this.props.document._id;
    const documentTitle = document.title || document.name || '';

    const deleteDocumentConfirm = this.context.intl.formatMessage(
      { id: 'forms.delete_confirm' },
      { title: documentTitle }
    );

    if (window.confirm(deleteDocumentConfirm)) {
      this.props
        .removeMutation({ documentId })
        .then(mutationResult => {
          // the mutation result looks like {data:{collectionRemove: null}} if succeeded
          if (this.props.removeSuccessCallback) this.props.removeSuccessCallback({ documentId, documentTitle });
          if (this.props.refetch) this.props.refetch();
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    }
  };

  // --------------------------------------------------------------------- //
  // ----------------------------- Render -------------------------------- //
  // --------------------------------------------------------------------- //

  render() {
    const fieldGroups = this.getFieldGroups();
    const collectionName = this.getCollection()._name;

    return (
      <div className={'document-' + this.getFormType()}>
        <Formsy.Form onSubmit={this.submitForm} onKeyDown={this.formKeyDown} ref={e => { this.form = e; }}>
          <Components.FormErrors errors={this.state.errors} />

          {fieldGroups.map(group => (
            <Components.FormGroup
              key={group.name}
              {...group}
              errors={this.state.errors}
              throwError={this.throwError}
              currentValues={this.state.currentValues}
              updateCurrentValues={this.updateCurrentValues}
              deletedValues={this.state.deletedValues}
              addToDeletedValues={this.addToDeletedValues}
              clearFieldErrors={this.clearFieldErrors}
              formType={this.getFormType()}
              currentUser={this.props.currentUser}
              disabled={this.state.disabled}
            />
          ))}

          {this.props.repeatErrors && this.renderErrors()}

          <Components.FormSubmit
            submitLabel={this.props.submitLabel}
            cancelLabel={this.props.cancelLabel}
            revertLabel={this.props.revertLabel}
            cancelCallback={this.props.cancelCallback}
            revertCallback={this.props.revertCallback}
            document={this.getDocument()}
            deleteDocument={(this.getFormType() === 'edit' && this.props.showRemove && this.deleteDocument) || null}
            collectionName={collectionName}
          />
        </Formsy.Form>
      </div>
    );
  }
}

SmartForm.propTypes = {
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
  addFields: PropTypes.arrayOf(PropTypes.string),
  removeFields: PropTypes.arrayOf(PropTypes.string),
  hideFields: PropTypes.arrayOf(PropTypes.string), // OpenCRUD backwards compatibility
  showRemove: PropTypes.bool,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  revertLabel: PropTypes.string,
  repeatErrors: PropTypes.bool,
  warnUnsavedChanges: PropTypes.bool,

  // callbacks
  submitCallback: PropTypes.func,
  successCallback: PropTypes.func,
  removeSuccessCallback: PropTypes.func,
  errorCallback: PropTypes.func,
  cancelCallback: PropTypes.func,
  revertCallback: PropTypes.func,

  currentUser: PropTypes.object,
  client: PropTypes.object,
};

SmartForm.defaultProps = {
  layout: 'horizontal',
  prefilledProps: {},
  repeatErrors: false,
  showRemove: true,
};

SmartForm.contextTypes = {
  intl: intlShape,
};

SmartForm.childContextTypes = {
  addToDeletedValues: PropTypes.func,
  deletedValues: PropTypes.array,
  addToSubmitForm: PropTypes.func,
  addToFailureForm: PropTypes.func,
  addToSuccessForm: PropTypes.func,
  updateCurrentValues: PropTypes.func,
  setFormState: PropTypes.func,
  throwError: PropTypes.func,
  clearForm: PropTypes.func,
  refetchForm: PropTypes.func,
  isChanged: PropTypes.func,
  initialDocument: PropTypes.object,
  getDocument: PropTypes.func,
  getLabel: PropTypes.func,
  submitForm: PropTypes.func,
  errors: PropTypes.array,
  currentValues: PropTypes.object,
};

module.exports = SmartForm;

registerComponent('Form', SmartForm);
