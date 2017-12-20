/*

Generate the appropriate fragment for the current form, then
wrap the main Form component with the necessary HoCs while passing 
them the fragment. 

This component is itself wrapped with:

- withCurrentUser
- withApollo (used to access the Apollo client for form pre-population)

And wraps the Form component with:

- withNew

Or: 

- withDocument
- withEdit
- withRemove

(When wrapping with withDocument, withEdit, and withRemove, a special Loader
component is also added to wait for withDocument's loading prop to be false)

*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { withApollo, compose } from 'react-apollo';
import { Components, registerComponent, withCurrentUser, Utils, withNew, withEdit, withRemove } from 'meteor/vulcan:core';
import Form from './Form.jsx';
import gql from 'graphql-tag';
import { withDocument } from 'meteor/vulcan:core';

class FormWrapper extends PureComponent {

  constructor(props) {
    super(props);
    // instantiate the wrapped component in constructor, not in render
    // see https://reactjs.org/docs/higher-order-components.html#dont-use-hocs-inside-the-render-method
    this.FormComponent = this.getComponent();
  }

  // return the current schema based on either the schema or collection prop
  getSchema() {
    return this.props.schema ? this.props.schema : Utils.stripTelescopeNamespace(this.props.collection.simpleSchema()._schema);
  }

  // if a document is being passed, this is an edit form
  getFormType() {
    return this.props.documentId || this.props.slug ? "edit" : "new";
  }

  // get fragment used to decide what data to load from the server to populate the form,
  // as well as what data to ask for as return value for the mutation
  getFragments() {

    const prefix = `${this.props.collection._name}${Utils.capitalize(this.getFormType())}`
    const fragmentName = `${prefix}FormFragment`;

    const schema = this.getSchema();
    const fields = this.props.fields;
    const viewableFields = _.filter(_.keys(schema), fieldName => !!schema[fieldName].viewableBy);
    const insertableFields = _.filter(_.keys(schema), fieldName => !!schema[fieldName].insertableBy);
    const editableFields = _.filter(_.keys(schema), fieldName => !!schema[fieldName].editableBy);

    // get all editable/insertable fields (depending on current form type)
    let queryFields = this.getFormType() === 'new' ? insertableFields : editableFields;
    // for the mutations's return value, also get non-editable but viewable fields (such as createdAt, userId, etc.)
    let mutationFields = this.getFormType() === 'new' ? _.unique(insertableFields.concat(viewableFields)) : _.unique(insertableFields.concat(editableFields));

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== "undefined" && fields.length > 0) {
      queryFields = _.intersection(queryFields, fields);
      mutationFields = _.intersection(mutationFields, fields);
    }

    // resolve any array field with resolveAs as fieldName{_id} -> why?
    /* 
    - string field with no resolver -> fieldName
    - string field with a resolver  -> fieldName
    - array field with no resolver  -> fieldName
    - array field with a resolver   -> fieldName{_id}
    */
    const mapFieldNameToField = fieldName => {
      const field = this.getSchema()[fieldName];
      return field.resolveAs && field.type.definitions[0].type === Array
        ? `${fieldName}` // if it's a custom resolver, add a basic query to its _id
        : fieldName; // else just ask for the field name
    }
    queryFields = queryFields.map(mapFieldNameToField);
    mutationFields = mutationFields.map(mapFieldNameToField);

    // generate query fragment based on the fields that can be edited. Note: always add _id.
    const generatedQueryFragment = gql`
      fragment ${fragmentName} on ${this.props.collection.typeName} {
        _id
        ${queryFields.join('\n')}
      }
    `
    // generate mutation fragment based on the fields that can be edited and/or viewed. Note: always add _id.
    const generatedMutationFragment = gql`
      fragment ${fragmentName} on ${this.props.collection.typeName} {
        _id
        ${mutationFields.join('\n')}
      }
    `

    // get query & mutation fragments from props or else default to same as generatedFragment
    // note: mutationFragment should probably always be specified in props
    return {
      queryFragment: this.props.queryFragment || generatedQueryFragment,
      mutationFragment: this.props.mutationFragment || generatedMutationFragment,
    };
  }

  getComponent() {

    // console.log(this)

    let WrappedComponent;

    const prefix = `${this.props.collection._name}${Utils.capitalize(this.getFormType())}`

    // props received from parent component (i.e. <Components.SmartForm/> call)
    const parentProps = this.props;

    // props to pass on to child component (i.e. <Form />)
    const childProps = {
      formType: this.getFormType(),
      schema: this.getSchema(),
    };

    // options for withDocument HoC
    const queryOptions = {
      queryName: `${prefix}FormQuery`,
      collection: this.props.collection,
      fragment: this.getFragments().queryFragment,
      fetchPolicy: 'network-only', // we always want to load a fresh copy of the document
      enableCache: false,    
    };

    // options for withNew, withEdit, and withRemove HoCs
    const mutationOptions = {
      collection: this.props.collection,
      fragment: this.getFragments().mutationFragment,
    };

    // if this is an edit from, load the necessary data using the withDocument HoC
    if (this.getFormType() === 'edit') {
      // create a stateless loader component that's wrapped with withDocument,
      // displays the loading state if needed, and passes on loading and document
      const Loader = props => {
        const { document, loading } = props;
        return loading ? 
          <Components.Loading /> : 
          <Form 
            document={document}
            loading={loading}
            {...childProps}
            {...parentProps}
            {...props}
          />;
      };
      Loader.displayName = `withLoader(Form)`;

      WrappedComponent = compose(
        withDocument(queryOptions),
        withEdit(mutationOptions),
        withRemove(mutationOptions)
      )(Loader);

      return <WrappedComponent documentId={this.props.documentId} slug={this.props.slug} />
    
    } else {

      WrappedComponent = compose(
        withNew(mutationOptions)
      )(Form);

      return <WrappedComponent {...childProps} {...parentProps} />;
    
    }
  }

  shouldComponentUpdate(nextProps) {
    // prevent extra re-renderings for unknown reasons
    // re-render only if the document selector changes
    return nextProps.slug !== this.props.slug || nextProps.documentId !== this.props.documentId;
  }

  render() {
    return this.FormComponent;
  }
}

FormWrapper.propTypes = {
  // main options
  collection: PropTypes.object.isRequired,
  documentId: PropTypes.string, // if a document is passed, this will be an edit form
  schema: PropTypes.object, // usually not needed
  queryFragment: PropTypes.object,
  mutationFragment: PropTypes.object,

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

FormWrapper.defaultProps = {
  layout: 'horizontal',
}

FormWrapper.contextTypes = {
  closeCallback: PropTypes.func,
  intl: intlShape
}

FormWrapper.childContextTypes = {
  autofilledValues: PropTypes.object,
  addToAutofilledValues: PropTypes.func,
  updateCurrentValues: PropTypes.func,
  throwError: PropTypes.func,
  getDocument: PropTypes.func
}

registerComponent('SmartForm', FormWrapper, withCurrentUser, withApollo);
