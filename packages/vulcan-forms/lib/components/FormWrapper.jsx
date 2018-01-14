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
import { graphql } from 'react-apollo';

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

    // console.log(this)

    let WrappedComponent;

    const prefix = `${this.props.collection._name}${Utils.capitalize(this.getFormType())}`

    // props received from parent component (i.e. <Components.SmartForm/> call)
    const parentProps = this.props;

    const { queryFragment, mutationFragment, extraQueries } = this.getFragments();

    // props to pass on to child component (i.e. <Form />)
    const childProps = {
      formType: this.getFormType(),
      schema: this.getSchema(),
    };

    // options for withDocument HoC
    const queryOptions = {
      queryName: `${prefix}FormQuery`,
      collection: this.props.collection,
      fragment: queryFragment,
      extraQueries,
      fetchPolicy: 'network-only', // we always want to load a fresh copy of the document
      enableCache: false,
      pollInterval: 0, // no polling, only load data once
    };

    // options for withNew, withEdit, and withRemove HoCs
    const mutationOptions = {
      collection: this.props.collection,
      fragment: mutationFragment,
    };

    // create a stateless loader component,
    // displays the loading state if needed, and passes on loading and document/data
    const Loader = props => {
      const { document, loading } = props;
      return (!document && loading) ?
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
              const { ownProps, data } = returnedProps;
              console.log(data)
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
        )(Form);
      }

      return <WrappedComponent {...childProps} {...parentProps} />;

    }
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

registerComponent('SmartForm', FormWrapper, withCurrentUser, withApollo);
