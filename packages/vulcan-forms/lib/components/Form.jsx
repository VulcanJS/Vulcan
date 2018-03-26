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

import { Components, runCallbacks, getCollection } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import Formsy from 'formsy-react';
import { getEditableFields, getInsertableFields, isEmptyValue } from '../modules/utils.js';
import deepmerge from 'deepmerge';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import unset from 'lodash/unset';
import compact from 'lodash/compact';
import update from 'lodash/update';
import { convertSchema } from '../modules/schema_utils';

// unsetCompact
const unsetCompact = (object, path) => {
  const parentPath = path.slice(0, path.lastIndexOf('.'));
  unset(object, path);
  update(object, parentPath, compact);
};

/*

1. Constructor
2. Helpers
3. Errors
4. Context
4. Method & Callback
5. Render

*/

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      errors: [],
      autofilledValues: {},
      deletedValues: [],
      currentValues: {},
    };

    this.schema = convertSchema(props.collection.simpleSchema());
    // Also store all field schemas (including nested schemas) in a flat structure
    this.fieldSchemas = convertSchema(props.collection.simpleSchema(), true);
  }

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

  getFieldProperty = (fieldName, propertyName, fieldSchema) => {
    return fieldSchema.get(fieldName, propertyName); // TODO
  };

  /*
  
  If a document is being passed, this is an edit form

  */
  getFormType = () => {
    return this.props.document ? 'edit' : 'new';
  };

  /*

  Get the document initially passed as props

  */
  getInitialDocument = () => {
    return deepmerge.all([this.props.prefilledProps, this.props.document]);
  };

  /*

  Get the current document (for edit forms)

  for each field, we apply the following logic:
  - if its value was provided by prefilledProps, use that
  - unless its value was provided by the db (i.e. props.document)
  - unless if its value is provided by the autofilledValues object
  - unless its value is currently being inputted

  */
  getDocument = () => {
    return deepmerge.all([
      this.props.prefilledProps,
      this.props.document,
      this.state.autofilledValues,
      this.state.currentValues,
    ]);
  };

  /*
  
  Like getDocument, but cross-reference with getFieldNames() 
  to only return fields that actually need to be submitted

  Also remove any deleted values. 
  
  */
  getData = () => {
    // only keep relevant fields
    const fields = this.getFieldNames();
    let data = cloneDeep(_.pick(this.getDocument(), ...fields));

    // remove any deleted values
    // (deleted nested fields cannot be added to $unset, instead we need to modify their value directly)
    this.state.deletedValues.forEach(path => {
      unsetCompact(data, path);
    });

    // run data object through submitForm callbacks
    data = runCallbacks(this.submitFormCallbacks, data);

    return data;
  };

  // --------------------------------------------------------------------- //
  // -------------------------------- Fields ----------------------------- //
  // --------------------------------------------------------------------- //

  /*

  Get a field's value in a document // TODO: maybe not needed?

  */
  getValue = (fieldName, fieldSchema, document) => {
    if (typeof document[fieldName] !== 'undefined' && document[fieldName] !== null) {
      let value = document[fieldName];
      // convert value type if needed
      if (fieldSchema.type.definitions[0].type === Number) value = Number(value);

      // if value is an array of objects ({_id: '123'}, {_id: 'abc'}), flatten it into an array of strings (['123', 'abc'])
      // fallback to item itself if item._id is not defined (ex: item is not an object or item is just {slug: 'xxx'})
      // if (Array.isArray(field.value)) {
      //   field.value = field.value.map(item => item._id || item);
      // }
      // TODO: not needed anymore?

      return value;
    }
    return null;
  };


  /*

  Given a field's name, its schema, document, and parent, create the 
  complete field object to be passed to the component

  */
  createField = (fieldName, schema, parentFieldName, parentPath) => {
    const fieldPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    
    // console.log('// createField', fieldPath);

    const fieldSchema = schema[fieldName];

    // console.log(fieldSchema);
    // console.log('-> nested: ', !!fieldSchema.schema);

    fieldSchema.name = fieldName;

    // intialize properties
    let field = {
      name: fieldName,
      path: fieldPath,
      datatype: fieldSchema.type,
      control: fieldSchema.control,
      layout: this.props.layout,
      order: fieldSchema.order,
    };

    // if field has a parent field and index, pass them on
    if (parentFieldName) {
      field.parentFieldName = parentFieldName;
    }

    field.label = this.getLabel(fieldName);

    // backward compatibility from 'autoform' to 'form'
    if (fieldSchema.autoform) {
      fieldSchema.form = fieldSchema.autoform;
      // eslint-disable-next-line no-console
      console.warn(
        `Vulcan Warning: The 'autoform' field is deprecated. You should rename it to 'form' instead. It was defined on your '${fieldName}' field  on the '${
          this.getCollection()._name
        }' collection`
      ); // eslint-disable-line
    }

    // replace value by prefilled value if value is empty
    const prefill = fieldSchema.prefill || (fieldSchema.form && fieldSchema.form.prefill);
    if (prefill) {
      const prefilledValue = typeof prefill === 'function' ? prefill.call(fieldSchema) : prefill;
      if (!!prefilledValue && !field.value) {
        field.prefilledValue = prefilledValue;
        field.value = prefilledValue;
      }
    }

    // add options if they exist
    const fieldOptions = fieldSchema.options || (fieldSchema.form && fieldSchema.form.options);
    if (fieldOptions) {
      field.options = typeof fieldOptions === 'function' ? fieldOptions.call(fieldSchema, this.props) : fieldOptions;

      // in case of checkbox groups, check "checked" option to populate value if this is a "new document" form
      const checkedValues = _.where(field.options, { checked: true }).map(option => option.value);
      if (checkedValues.length && !field.value && this.getFormType() === 'new') {
        field.value = checkedValues;
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
          field[prop] =
            typeof fieldProperties[prop] === 'function'
              ? fieldProperties[prop].call(fieldSchema)
              : fieldProperties[prop];
        }
      }
    }

    // add limit
    // TODO: doesn't work for nested fields because this.getCollection().simpleSchema() doesn't return nested schema
    const limit =
      fieldSchema.limit ||
      this.getCollection()
        .simpleSchema()
        .get(fieldName, 'max');
    if (limit) {
      field.limit = limit;
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
    field.document = this.getInitialDocument();

    // add any relevant errors
    // const fieldErrors = _.filter(this.state.errors, error => error.data.name === fieldName);
    // if (fieldErrors) {
    //   field.errors = fieldErrors.map(error => ({ ...error, message: this.getErrorMessage(error) }));
    // }

    // nested fields: set control to "nested"
    const nestedSchema = fieldSchema.schema;

    if (nestedSchema) {
      field.nestedSchema = nestedSchema;
      field.control = 'nested';
      // get nested schema
      // for each nested field, get field object by calling createField recursively
      field.nestedFields = this.getFieldNames(nestedSchema).map(subFieldName => {
        return this.createField(subFieldName, nestedSchema, fieldName, fieldPath);
      });
    }

    return field;
  };

  /*

  Get all field groups

  */
  getFieldGroups = () => {
    // build fields array by iterating over the list of field names
    let fields = this.getFieldNames().map(fieldName => {
      // get schema for the current field
      return this.createField(fieldName, this.schema);
    });

    fields = _.sortBy(fields, 'order');

    // get list of all unique groups (based on their name) used in current fields
    let groups = _.compact(_.unique(_.pluck(fields, 'group'), false, g => g && g.name));

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

  */
  getFieldNames = (schema = this.schema) => {
    const { fields, hideFields } = this.props;

    // get all editable/insertable fields (depending on current form type)
    let relevantFields =
      this.getFormType() === 'edit'
        ? getEditableFields(schema, this.props.currentUser, this.getInitialDocument())
        : getInsertableFields(schema, this.props.currentUser);

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== 'undefined' && fields.length > 0) {
      relevantFields = _.intersection(relevantFields, fields);
    } else {
      // else if fields is not specified, remove all hidden fields
      relevantFields = _.reject(relevantFields, fieldName => {
        const hidden = schema[fieldName].hidden;
        return typeof hidden === 'function' ? hidden(this.props) : hidden;
      });
    }

    // if "hideFields" prop is specified, remove its fields
    if (typeof hideFields !== 'undefined' && hideFields.length > 0) {
      relevantFields = _.difference(relevantFields, hideFields);
    }

    return relevantFields;
  };

  /*

  Get a field's label

  */
  getLabel = fieldName => {
    return this.context.intl.formatMessage({
      id: this.getCollection()._name + '.' + fieldName,
      defaultMessage: this.fieldSchemas[fieldName].label,
    });
  };

  // --------------------------------------------------------------------- //
  // ------------------------------- Errors ------------------------------ //
  // --------------------------------------------------------------------- //

  getErrorMessage = error => {
    if (error.data.fieldName) {
      // if error has a corresponding field name, "labelify" that field name
      const fieldName = this.getLabel(error.data.fieldName);
      return this.context.intl.formatMessage({ id: error.id, defaultMessage: error.id }, { ...error.data, fieldName });
    } else {
      return this.context.intl.formatMessage({ id: error.id, defaultMessage: error.id }, error.data);
    }
  };

  // --------------------------------------------------------------------- //
  // ------------------------------- Context ----------------------------- //
  // --------------------------------------------------------------------- //

  // add error to form state
  // from "GraphQL Error: You have an error [error_code]"
  // to { content: "You have an error", type: "error" }
  throwError = error => {
    // get graphQL error (see https://github.com/thebigredgeek/apollo-errors/issues/12)
    const graphQLError = error.graphQLErrors[0];
    // eslint-disable-next-line no-console
    console.log(graphQLError);

    // add error to state
    this.setState(prevState => ({
      errors: [...prevState.errors, ...graphQLError.data.errors],
    }));
  };

  // add something to autofilled values
  addToAutofilledValues = property => {
    this.setState(prevState => ({
      autofilledValues: {
        ...prevState.autofilledValues,
        ...property,
      },
    }));
  };

  // get autofilled values
  getAutofilledValues = () => {
    return this.state.autofilledValues;
  };

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
      () => this.submitForm(this.refs.form.getModel())
    );
  };

  // pass on context to all child components
  getChildContext = () => {
    return {
      throwError: this.throwError,
      clearForm: this.clearForm,
      submitForm: this.submitFormContext, //Change in name because we already have a function called submitForm, but no reason for the user to know about that
      getAutofilledValues: this.getAutofilledValues,
      addToAutofilledValues: this.addToAutofilledValues,
      addToDeletedValues: this.addToDeletedValues,
      updateCurrentValues: this.updateCurrentValues,
      getDocument: this.getDocument,
      getInitialDocument: this.getInitialDocument,
      setFormState: this.setFormState,
      addToSubmitForm: this.addToSubmitForm,
      addToSuccessForm: this.addToSuccessForm,
      addToFailureForm: this.addToFailureForm,
      errors: this.state.errors,
      currentValues: this.state.currentValues,
      autofilledValues: this.state.autofilledValues,
      deletedValues: this.state.deletedValues,
    };
  };

  // --------------------------------------------------------------------- //
  // ------------------------------ Lifecycle ---------------------------- //
  // --------------------------------------------------------------------- //

  /*
  
  Manually update the current values of one or more fields(i.e. on change or blur). 
  
  */
  updateCurrentValues = newValues => {
    // keep the previous ones and extend (with possible replacement) with new ones
    this.setState(prevState => {
      const newState = cloneDeep(prevState);
      Object.keys(newValues).forEach(key => {
        const path = key;
        const value = newValues[key];
        if (value === null) {
          // delete value
          this.addToDeletedValues(path);
        } else {
          set(newState.currentValues, path, value);
        }
      });
      return newState;
    });
  };

  /* 
  
  Clear and reset the form
  By default, clear errors and keep current values and deleted values

  */
  clearForm = ({ clearErrors = true, clearCurrentValues = false, clearDeletedValues = false }) => {
    this.setState(prevState => ({
      errors: clearErrors ? [] : prevState.errors,
      currentValues: clearCurrentValues ? {} : prevState.currentValues,
      deletedValues: clearDeletedValues ? [] : prevState.deletedValues,
      disabled: false,
    }));
  };

  /*
  
  Key down handler

  */
  formKeyDown = event => {
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
      this.submitForm(this.refs.form.getModel());
    }
  };

  newMutationSuccessCallback = result => {
    this.mutationSuccessCallback(result, 'new');
  };

  editMutationSuccessCallback = result => {
    this.mutationSuccessCallback(result, 'edit');
  };

  mutationSuccessCallback = (result, mutationType) => {
    const document = result.data[Object.keys(result.data)[0]]; // document is always on first property

    // for new mutation, run refetch function if it exists
    if (mutationType === 'new' && this.props.refetch) this.props.refetch();

    // call the clear form method (i.e. trigger setState) only if the form has not been unmounted (we are in an async callback, everything can happen!)
    if (typeof this.refs.form !== 'undefined') {
      let clearCurrentValues = false;
      // reset form if this is a new document form
      if (this.getFormType() === 'new') {
        this.refs.form.reset();
        clearCurrentValues = true;
      }
      this.clearForm({ clearErrors: true, clearCurrentValues, clearDeletedValues: true });
    }

    // run document through mutation success callbacks
    result = runCallbacks(this.successFormCallbacks, result);

    // run success callback if it exists
    if (this.props.successCallback) this.props.successCallback(document);
  };

  // catch graphql errors
  mutationErrorCallback = error => {
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

    // note: we don't have access to the document here :( maybe use redux-forms and get it from the store?
    // run error callback if it exists
    // if (this.props.errorCallback) this.props.errorCallback(document, error);
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
    // data = deepmerge(this.getDocument(), data);
    data = this.getData();

    // console.log(data)

    const fields = this.getFieldNames();

    // if there's a submit callback, run it
    if (this.props.submitCallback) {
      data = this.props.submitCallback(data);
    }

    if (this.getFormType() === 'new') {
      // new document form

      // remove any empty properties
      let document = _.compactObject(data);
      // call method with new document
      this.props
        .newMutation({ document })
        .then(this.newMutationSuccessCallback)
        .catch(this.mutationErrorCallback);
    } else {
      // edit document form

      const document = this.getDocument();

      // put all keys with data on $set
      const set = _.compactObject(data);

      // put all keys without data on $unset
      const setKeys = _.keys(set);
      let unsetKeys = _.difference(fields, setKeys);

      // add all keys to delete (minus those that have data associated)
      unsetKeys = _.unique(unsetKeys.concat(_.difference(this.state.deletedValues, setKeys)));

      // only keep unset keys that correspond to a field (get rid of nested keys)
      unsetKeys = _.intersection(unsetKeys, this.getFieldNames());

      // build mutation arguments object
      const args = { documentId: document._id, set: set, unset: {} };
      if (unsetKeys.length > 0) {
        args.unset = _.object(unsetKeys, unsetKeys.map(() => true));
      }
      // call method with _id of document being edited and modifier
      this.props
        .editMutation(args)
        .then(this.editMutationSuccessCallback)
        .catch(this.mutationErrorCallback);
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
        <Formsy.Form onSubmit={this.submitForm} onKeyDown={this.formKeyDown} disabled={this.state.disabled} ref="form">
          <Components.FormErrors errors={this.state.errors} />

          {fieldGroups.map(group => (
            <Components.FormGroup key={group.name} {...group} updateCurrentValues={this.updateCurrentValues} />
          ))}

          {this.props.repeatErrors && this.renderErrors()}

          <Components.FormSubmit
            submitLabel={this.props.submitLabel}
            cancelLabel={this.props.cancelLabel}
            cancelCallback={this.props.cancelCallback}
            document={this.getDocument()}
            deleteDocument={(this.getFormType() === 'edit' && this.props.showRemove && this.deleteDocument) || null}
            collectionName={collectionName}
          />
        </Formsy.Form>
      </div>
    );
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
};

Form.defaultProps = {
  layout: 'horizontal',
  prefilledProps: {},
  repeatErrors: false,
  showRemove: true,
};

Form.contextTypes = {
  intl: intlShape,
};

Form.childContextTypes = {
  getAutofilledValues: PropTypes.func,
  addToAutofilledValues: PropTypes.func,
  addToDeletedValues: PropTypes.func,
  deletedValues: PropTypes.array,
  addToSubmitForm: PropTypes.func,
  addToFailureForm: PropTypes.func,
  addToSuccessForm: PropTypes.func,
  updateCurrentValues: PropTypes.func,
  setFormState: PropTypes.func,
  throwError: PropTypes.func,
  clearForm: PropTypes.func,
  getInitialDocument: PropTypes.func,
  getDocument: PropTypes.func,
  submitForm: PropTypes.func,
  errors: PropTypes.array,
  currentValues: PropTypes.object,
  autofilledValues: PropTypes.object,
};

module.exports = Form;
