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

import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { withApollo, compose } from 'react-apollo';
import { Components, registerComponent, withCurrentUser, Utils, withNew, withEdit, withRemove } from 'meteor/vulcan:core';
import Form from './Form.jsx';
import gql from 'graphql-tag';
import { withDocument } from 'meteor/vulcan:core';

class FormWrapper extends Component{

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
    const insertableFields = _.filter(_.keys(schema), fieldName => !!schema[fieldName].insertableBy);
    const editableFields = _.filter(_.keys(schema), fieldName => !!schema[fieldName].editableBy);

    // get all editable/insertable fields (depending on current form type)
    let relevantFields = this.getFormType() === 'new' ? insertableFields : editableFields;

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== "undefined" && fields.length > 0) {
      relevantFields = _.intersection(relevantFields, fields);
    }

    // resolve any array field with resolveAs as fieldName{_id}
    /* 
    - string field with no resolver -> fieldName
    - string field with a resolver  -> fieldName
    - array field with no resolver  -> fieldName
    - array field with a resolver   -> fieldName{_id}
    */
    relevantFields = relevantFields.map(fieldName => {
      const field = this.getSchema()[fieldName]
      return field.resolveAs && field.type.definitions[0].type === Array
        ? `${fieldName}{_id}` // if it's a custom resolver, add a basic query to its _id
        : fieldName; // else just ask for the field name
    });

    // generate fragment based on the fields that can be edited. Note: always add _id.
    const generatedFragment = gql`
      fragment ${fragmentName} on ${this.props.collection.typeName} {
        _id
        ${relevantFields.join('\n')}
      }
    `

    // get query & mutation fragments from props or else default to same as generatedFragment
    // note: mutationFragment should probably always be specified in props
    return {
      queryFragment: this.props.queryFragment || generatedFragment,
      mutationFragment: this.props.mutationFragment || generatedFragment,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (this.getFormType() === 'edit') {
      // re-render only if the document selector changes
      return nextProps.slug !== this.props.slug || nextProps.documentId !== this.props.documentId;
    }
    
    // prevent extra re-renderings for unknown reasons
    return false;
  }

  render() {

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
      }
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

      return <WrappedComponent {...childProps} {...parentProps} />
    
    }

  }

}

FormWrapper.propTypes = {

  // main options
  collection: React.PropTypes.object.isRequired,
  documentId: React.PropTypes.string, // if a document is passed, this will be an edit form
  schema: React.PropTypes.object, // usually not needed
  queryFragment: React.PropTypes.object,
  mutationFragment: React.PropTypes.object,

  // graphQL
  newMutation: React.PropTypes.func, // the new mutation
  editMutation: React.PropTypes.func, // the edit mutation
  removeMutation: React.PropTypes.func, // the remove mutation

  // form
  prefilledProps: React.PropTypes.object,
  layout: React.PropTypes.string,
  fields: React.PropTypes.arrayOf(React.PropTypes.string),
  showRemove: React.PropTypes.bool,

  // callbacks
  submitCallback: React.PropTypes.func,
  successCallback: React.PropTypes.func,
  removeSuccessCallback: React.PropTypes.func,
  errorCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func,

  currentUser: React.PropTypes.object,
  client: React.PropTypes.object,
}

FormWrapper.defaultProps = {
  layout: "horizontal",
}

FormWrapper.contextTypes = {
  closeCallback: React.PropTypes.func,
  intl: intlShape
}

FormWrapper.childContextTypes = {
  autofilledValues: React.PropTypes.object,
  addToAutofilledValues: React.PropTypes.func,
  updateCurrentValues: React.PropTypes.func,
  throwError: React.PropTypes.func,
  getDocument: React.PropTypes.func
}

registerComponent('SmartForm', FormWrapper, withCurrentUser, withApollo);

export default withCurrentUser(withApollo(FormWrapper));