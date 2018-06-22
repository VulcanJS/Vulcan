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
import { withRouter } from 'react-router'
import { withApollo, compose } from 'react-apollo';
import {
  Components,
  registerComponent,
  withCurrentUser,
  Utils,
  withNew,
  withEdit,
  withRemove,
  getFragment,
  getCollection,
  isIntlField,
} from 'meteor/vulcan:core';
import gql from 'graphql-tag';
import { withDocument } from 'meteor/vulcan:core';
import { graphql } from 'react-apollo';

class FormWrapper extends PureComponent {

  constructor(props) {
    super(props);
    // instantiate the wrapped component in constructor, not in render
    // see https://reactjs.org/docs/higher-order-components.html#dont-use-hocs-inside-the-render-method
    this.FormComponent = this.getComponent(props);
  }

  getCollection() {
    return this.props.collection || getCollection(this.props.collectionName);
  }

  // return the current schema based on either the schema or collection prop
  getSchema() {
    return this.props.schema ? this.props.schema : this.getCollection().simpleSchema()._schema;
  }

  // if a document is being passed, this is an edit form
  getFormType() {
    return this.props.documentId || this.props.slug ? "edit" : "new";
  }

  getReadableFields() {
    // OpenCRUD backwards compatibility
    return Object.keys(this.getSchema()).filter(fieldName => schema[fieldName].canRead || schema[fieldName].viewableBy);
  }

  getCreateableFields() {
    // OpenCRUD backwards compatibility
    return Object.keys(this.getSchema()).filter(fieldName => schema[fieldName].canCreate || schema[fieldName].insertableBy);
  }

  getUpdatetableFields() {
    // OpenCRUD backwards compatibility
    return Object.keys(this.getSchema()).filter(fieldName => schema[fieldName].canUpdate || schema[fieldName].editableBy);
  }

  // get fragment used to decide what data to load from the server to populate the form,
  // as well as what data to ask for as return value for the mutation
  getFragments() {

    const prefix = `${this.getCollection()._name}${Utils.capitalize(this.getFormType())}`
    const fragmentName = `${prefix}FormFragment`;

    const fields = this.props.fields;
    const readableFields = this.getReadableFields();
    const createableFields = this.getCreateableFields();
    const updatetableFields = this.getUpdatetableFields();

    // get all editable/insertable fields (depending on current form type)
    let queryFields = this.getFormType() === 'new' ? createableFields : updatetableFields;
    // for the mutations's return value, also get non-editable but viewable fields (such as createdAt, userId, etc.)
    let mutationFields = this.getFormType() === 'new' ? _.unique(createableFields.concat(readableFields)) : _.unique(createableFields.concat(updatetableFields));

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== "undefined" && fields.length > 0) {
      queryFields = _.intersection(queryFields, fields);
      mutationFields = _.intersection(mutationFields, fields);
    }
    
    // generate query fragment based on the fields that can be edited. Note: always add _id.
    const generatedQueryFragment = gql`
      fragment ${fragmentName} on ${this.getCollection().typeName} {
        _id
        ${queryFields.join('\n')}
      }
    `

    // generate mutation fragment based on the fields that can be edited and/or viewed. Note: always add _id.
    const generatedMutationFragment = gql`
      fragment ${fragmentName} on ${this.getCollection().typeName} {
        _id
        ${mutationFields.join('\n')}
      }
    `

    // default to generated fragments
    let queryFragment = generatedQueryFragment;
    let mutationFragment = generatedMutationFragment;

    // if queryFragment or mutationFragment props are specified, accept either fragment object or fragment string
    if (this.props.queryFragment) {
      queryFragment = typeof this.props.queryFragment === 'string' ? gql`${this.props.queryFragment}` : this.props.queryFragment;
    }
    if (this.props.mutationFragment) {
      mutationFragment = typeof this.props.mutationFragment === 'string' ? gql`${this.props.mutationFragment}` : this.props.mutationFragment;
    }

    // same with queryFragmentName and mutationFragmentName
    if (this.props.queryFragmentName) {
      queryFragment = getFragment(this.props.queryFragmentName);
    }
    if (this.props.mutationFragmentName) {
      mutationFragment = getFragment(this.props.mutationFragmentName);
    }

    // if any field specifies extra queries, add them
    const extraQueries = _.compact(queryFields.map(fieldName => {
      const field = this.getSchema()[fieldName];
      return field.query
    }));

    // get query & mutation fragments from props or else default to same as generatedFragment
    return {
      queryFragment,
      mutationFragment,
      extraQueries,
    };
  }

  getComponent() {

    let WrappedComponent;

    const prefix = `${this.getCollection()._name}${Utils.capitalize(this.getFormType())}`

    const { queryFragment, mutationFragment, extraQueries } = this.getFragments();

    // props to pass on to child component (i.e. <Form />)
    const childProps = {
      formType: this.getFormType(),
      schema: this.getSchema(),
    };

    // options for withDocument HoC
    const queryOptions = {
      queryName: `${prefix}FormQuery`,
      collection: this.getCollection(),
      fragment: queryFragment,
      extraQueries,
      fetchPolicy: 'network-only', // we always want to load a fresh copy of the document
      enableCache: false,
      pollInterval: 0, // no polling, only load data once
    };

    // options for withNew, withEdit, and withRemove HoCs
    const mutationOptions = {
      collection: this.getCollection(),
      fragment: mutationFragment,
    };

    // create a stateless loader component,
    // displays the loading state if needed, and passes on loading and document/data
    const Loader = props => {
      const { document, loading } = props;
      return loading ?
        <Components.Loading /> :
        <Components.Form
          document={document}
          loading={loading}
          {...childProps}
          {...props}
        />;
    };
    Loader.displayName = `withLoader(Form)`;

    // if this is an edit from, load the necessary data using the withDocument HoC
    if (this.getFormType() === 'edit') {

      WrappedComponent = compose(
        withDocument(queryOptions),
        withEdit(mutationOptions),
        withRemove(mutationOptions)
      )(Loader);

      return <WrappedComponent documentId={this.props.documentId} slug={this.props.slug} />

    } else {

      if (extraQueries && extraQueries.length) {

        const extraQueriesHoC = graphql(gql`
          query formNewExtraQuery {
            ${extraQueries}
          }`, {
            alias: 'withExtraQueries',
            props: returnedProps => {
              const { /* ownProps, */ data } = returnedProps;
              const props = {
                loading: data.loading,
                data,
              };
              return props;
            },
          });

        WrappedComponent = compose(
          extraQueriesHoC,
          withNew(mutationOptions)
        )(Loader);

      } else {
        WrappedComponent = compose(
          withNew(mutationOptions)
        )(Components.Form);
      }

      return <WrappedComponent {...childProps} />;

    }
  }

  render() {
    const component = this.FormComponent;
    const componentWithParentProps = React.cloneElement(component, this.props);
    return componentWithParentProps;
  }
}

FormWrapper.propTypes = {
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
  documentId: PropTypes.string, // if a document is passed, this will be an edit form
  schema: PropTypes.object, // usually not needed
  queryFragment: PropTypes.object,
  queryFragmentName: PropTypes.string,
  mutationFragment: PropTypes.object,
  mutationFragmentName: PropTypes.string,

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
}

FormWrapper.defaultProps = {
  layout: 'horizontal',
}

FormWrapper.contextTypes = {
  closeCallback: PropTypes.func,
  intl: intlShape
}

registerComponent('SmartForm', FormWrapper, withCurrentUser, withApollo, withRouter);
