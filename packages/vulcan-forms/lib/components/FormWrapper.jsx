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

- withSingle
- withUpdate
- withDelete

(When wrapping with withSingle, withUpdate, and withDelete, a special Loader
component is also added to wait for withSingle's loading prop to be false)

*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import {
  Components,
  registerComponent,
  withCurrentUser,
  Utils,
  withNew,
  withUpdate,
  withDelete,
  getFragment
} from 'meteor/vulcan:core';
import gql from 'graphql-tag';
import { withSingle } from 'meteor/vulcan:core';
import { graphql } from 'react-apollo';
import {
  getReadableFields,
  getCreateableFields,
  getUpdateableFields
} from '../modules/schema_utils';

import withCollectionProps from './withCollectionProps';
import { callbackProps } from './propTypes';

const intlSuffix = '_intl';

class FormWrapper extends PureComponent {
  constructor(props) {
    super(props);
    // instantiate the wrapped component in constructor, not in render
    // see https://reactjs.org/docs/higher-order-components.html#dont-use-hocs-inside-the-render-method
    this.FormComponent = this.getComponent(props);
  }
  // return the current schema based on either the schema or collection prop
  getSchema() {
    return this.props.schema
      ? this.props.schema
      : this.props.collection.simpleSchema()._schema;
  }

  // if a document is being passed, this is an edit form
  getFormType() {
    return this.props.documentId || this.props.slug ? 'edit' : 'new';
  }

  // get fragment used to decide what data to load from the server to populate the form,
  // as well as what data to ask for as return value for the mutation
  getFragments() {
    const prefix = `${this.props.collectionName}${Utils.capitalize(
      this.getFormType()
    )}`;
    const fragmentName = `${prefix}FormFragment`;

    const fields = this.props.fields;
    const readableFields = getReadableFields(this.getSchema());
    const createableFields = getCreateableFields(this.getSchema());
    const updatetableFields = getUpdateableFields(this.getSchema());

    // get all editable/insertable fields (depending on current form type)
    let queryFields =
      this.getFormType() === 'new' ? createableFields : updatetableFields;
    // for the mutations's return value, also get non-editable but viewable fields (such as createdAt, userId, etc.)
    let mutationFields =
      this.getFormType() === 'new'
        ? _.unique(createableFields.concat(readableFields))
        : _.unique(createableFields.concat(updatetableFields));

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== 'undefined' && fields.length > 0) {
      // add "_intl" suffix to all fields in case some of them are intl fields
      const fieldsWithIntlSuffix = fields.map(field => `${field}${intlSuffix}`);
      const allFields = [...fields, ...fieldsWithIntlSuffix];
      queryFields = _.intersection(queryFields, allFields);
      mutationFields = _.intersection(mutationFields, allFields);
    }

    // add "addFields" prop contents to list of fields
    if (this.props.addFields && this.props.addFields.length) {
      queryFields = queryFields.concat(this.props.addFields);
      mutationFields = mutationFields.concat(this.props.addFields);
    }

    const convertFields = field => {
      return field.slice(-5) === intlSuffix ? `${field}{ locale value }` : field;
    };

    // generate query fragment based on the fields that can be edited. Note: always add _id.
    const generatedQueryFragment = gql`
      fragment ${fragmentName} on ${this.props.typeName} {
        _id
        ${queryFields.map(convertFields).join('\n')}
      }
    `;

    // generate mutation fragment based on the fields that can be edited and/or viewed. Note: always add _id.
    const generatedMutationFragment = gql`
      fragment ${fragmentName} on ${this.props.typeName} {
        _id
        ${mutationFields.map(convertFields).join('\n')}
      }
    `;

    // default to generated fragments
    let queryFragment = generatedQueryFragment;
    let mutationFragment = generatedMutationFragment;

    // if queryFragment or mutationFragment props are specified, accept either fragment object or fragment string
    if (this.props.queryFragment) {
      queryFragment =
        typeof this.props.queryFragment === 'string'
          ? gql`
              ${this.props.queryFragment}
            `
          : this.props.queryFragment;
    }
    if (this.props.mutationFragment) {
      mutationFragment =
        typeof this.props.mutationFragment === 'string'
          ? gql`
              ${this.props.mutationFragment}
            `
          : this.props.mutationFragment;
    }

    // same with queryFragmentName and mutationFragmentName
    if (this.props.queryFragmentName) {
      queryFragment = getFragment(this.props.queryFragmentName);
    }
    if (this.props.mutationFragmentName) {
      mutationFragment = getFragment(this.props.mutationFragmentName);
    }

    // if any field specifies extra queries, add them
    const extraQueries = _.compact(
      queryFields.map(fieldName => {
        const field = this.getSchema()[fieldName];
        return field.query;
      })
    );

    // get query & mutation fragments from props or else default to same as generatedFragment
    return {
      queryFragment,
      mutationFragment,
      extraQueries
    };
  }

  getComponent() {
    let WrappedComponent;

    const prefix = `${this.props.collectionName}${Utils.capitalize(
      this.getFormType()
    )}`;

    const {
      queryFragment,
      mutationFragment,
      extraQueries
    } = this.getFragments();

    // props to pass on to child component (i.e. <Form />)
    const childProps = {
      formType: this.getFormType(),
      schema: this.getSchema()
    };

    // options for withSingle HoC
    const queryOptions = {
      queryName: `${prefix}FormQuery`,
      collection: this.props.collection,
      fragment: queryFragment,
      extraQueries,
      fetchPolicy: 'network-only', // we always want to load a fresh copy of the document
      enableCache: false,
      pollInterval: 0 // no polling, only load data once
    };

    // options for withNew, withUpdate, and withDelete HoCs
    const mutationOptions = {
      collection: this.props.collection,
      fragment: mutationFragment
    };

    // create a stateless loader component,
    // displays the loading state if needed, and passes on loading and document/data
    const Loader = props => {
      const { document, loading } = props;
      return loading ? (
        <Components.Loading />
      ) : (
        <Components.Form
          document={document}
          loading={loading}
          {...childProps}
          {...props}
        />
      );
    };
    Loader.displayName = 'withLoader(Form)';

    // if this is an edit from, load the necessary data using the withSingle HoC
    if (this.getFormType() === 'edit') {
      WrappedComponent = compose(
        withSingle(queryOptions),
        withUpdate(mutationOptions),
        withDelete(mutationOptions)
      )(Loader);

      return (
        <WrappedComponent
          selector={{
            documentId: this.props.documentId,
            slug: this.props.slug
          }}
        />
      );
    } else {
      if (extraQueries && extraQueries.length) {
        const extraQueriesHoC = graphql(
          gql`
          query formNewExtraQuery {
            ${extraQueries}
          }`,
          {
            alias: 'withExtraQueries',
            props: returnedProps => {
              const { /* ownProps, */ data } = returnedProps;
              const props = {
                loading: data.loading,
                data
              };
              return props;
            }
          }
        );

        WrappedComponent = compose(
          extraQueriesHoC,
          withNew(mutationOptions)
        )(Loader);
      } else {
        WrappedComponent = compose(withNew(mutationOptions))(Components.Form);
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
  collection: PropTypes.object.isRequired,
  collectionName: PropTypes.string.isRequired,
  typeName: PropTypes.string.isRequired,

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
  addFields: PropTypes.arrayOf(PropTypes.string),
  showRemove: PropTypes.bool,
  submitLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
  revertLabel: PropTypes.node,
  repeatErrors: PropTypes.bool,
  warnUnsavedChanges: PropTypes.bool,

  // callbacks
  ...callbackProps,

  currentUser: PropTypes.object,
  client: PropTypes.object
};

FormWrapper.defaultProps = {
  layout: 'horizontal'
};

FormWrapper.contextTypes = {
  closeCallback: PropTypes.func,
  intl: intlShape
};

registerComponent({
  name: 'SmartForm',
  component: FormWrapper,
  hocs: [withCurrentUser, withApollo, withRouter, withCollectionProps]
});
