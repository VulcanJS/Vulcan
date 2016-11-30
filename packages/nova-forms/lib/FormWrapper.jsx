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
- withEdit
- withRemove

(When wrapping with withSingle, withEdit, and withRemove, a special Loader
component is also added to wait for withSingle's loading prop to be false)

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { withApollo, compose } from 'react-apollo';
import { withCurrentUser } from 'meteor/nova:core';
import { withNew, withEdit, withRemove } from 'meteor/nova:core';
import { getEditableFields, getInsertableFields } from './utils.js';
import Form from './Form.jsx';
import gql from 'graphql-tag';
import { withSingle } from 'meteor/nova:core';

class FormWrapper extends Component{

  // return the current schema based on either the schema or collection prop
  getSchema() {
    return this.props.schema ? this.props.schema : Telescope.utils.stripTelescopeNamespace(this.props.collection.simpleSchema()._schema);
  }

  // if a document is being passed, this is an edit form
  getFormType() {
    return this.props.documentId ? "edit" : "new";
  }

  // get fragment used to decide what data to load from the server to populate the form,
  // as well as what data to ask for as return value for the mutation
  getFragment() {

    const prefix = `${this.props.collection._name}${Telescope.utils.capitalize(this.getFormType())}`
    const fragmentName = `${prefix}FormFragment`;

    const schema = this.getSchema();
    const fields = this.props.fields;
    const insertableFields = _.filter(_.keys(schema), fieldName => !!schema[fieldName].insertableIf);
    const editableFields = _.filter(_.keys(schema), fieldName => !!schema[fieldName].editableIf);

    // get all editable/insertable fields (depending on current form type)
    let relevantFields = this.getFormType() === 'new' ? insertableFields : editableFields;

    // if "fields" prop is specified, restrict list of fields to it
    if (typeof fields !== "undefined" && fields.length > 0) {
      relevantFields = _.intersection(relevantFields, fields);
    }

    // fields with resolvers that contain "[" should be treated as arrays of _ids
    // TODO: find a cleaner way to handle this
    relevantFields = relevantFields.map(fieldName => {
      const resolveAs = this.getSchema()[fieldName].resolveAs;
      return resolveAs && resolveAs.indexOf('[') > -1 ? `${fieldName}{_id}` : fieldName;
    });

    // generate fragment based on the fields that can be edited. Note: always add _id.
    const fragment = `fragment ${fragmentName} on ${this.props.collection.typeName} {
      _id
      ${relevantFields.join('\n')}
    }`

    return gql`${fragment}`;
  }

  // prevent extra re-renderings for unknown reasons
  shouldComponentUpdate() {
    return false;
  }

  render() {

    // console.log(this)

    let WrappedComponent;

    const prefix = `${this.props.collection._name}${Telescope.utils.capitalize(this.getFormType())}`
    const fragmentName = `${prefix}FormFragment`;

    // props received from parent component (i.e. <NovaForm/> call)
    const parentProps = this.props;

    // props to pass on to child component (i.e. <Form />)
    const childProps = {
      formType: this.getFormType(),
      schema: this.getSchema(),
    };

    // generic options for the withSingle, withNew, withEdit, and withRemove HoCs
    const options = {
      collection: this.props.collection,
      fragmentName: fragmentName,
      fragment: this.getFragment(),
    };

    // if this is an edit from, load the necessary data using the withSingle HoC
    if (this.getFormType() === 'edit') { 
    
      // create a stateless loader component that's wrapped with withSingle,
      // displays the loading state if needed, and passes on loading and document
      const Loader = props => {
        const { document, loading } = props;
        return loading ? 
          <Telescope.components.Loading /> : 
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
        withSingle({...options, queryName: `${prefix}FormQuery`}),
        withEdit(options),
        withRemove({...options, queryToUpdate: this.props.queryToUpdate})
      )(Loader);

      return <WrappedComponent documentId={this.props.documentId} />
    
    } else {

      WrappedComponent = compose(
        withNew({...options, queryToUpdate: this.props.queryToUpdate})
      )(Form);

      return <WrappedComponent {...childProps} {...parentProps} />
    
    }

  }

}

FormWrapper.propTypes = {

  // main options
  collection: React.PropTypes.object,
  documentId: React.PropTypes.string, // if a document is passed, this will be an edit form
  schema: React.PropTypes.object, // usually not needed

  // graphQL
  newMutation: React.PropTypes.func, // the new mutation
  editMutation: React.PropTypes.func, // the edit mutation
  removeMutation: React.PropTypes.func, // the remove mutation
  queryToUpdate: React.PropTypes.string, // query to update, used on new and remove mutation

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
  updateCurrentValue: React.PropTypes.func,
  throwError: React.PropTypes.func,
  getDocument: React.PropTypes.func
}

module.exports = compose(
  withCurrentUser,
  withApollo,
)(FormWrapper);