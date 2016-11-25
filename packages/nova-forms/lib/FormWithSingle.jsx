import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { withApollo, compose } from 'react-apollo';
import { withCurrentUser } from 'meteor/nova:core';
import { getEditableFields, getInsertableFields } from './utils.js';
import FormWithMutations from './FormWithMutations.jsx';
import gql from 'graphql-tag';
import { withSingle } from 'meteor/nova:core';

class FormWithSingle extends Component{

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

    const fields = this.props.fields;

    // get all editable/insertable fields (depending on current form type)
    let relevantFields = this.getFormType() === 'edit' ? getEditableFields(this.getSchema(), this.props.currentUser) : getInsertableFields(this.getSchema(), this.props.currentUser);

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

    const prefix = `${this.props.collection._name}${Telescope.utils.capitalize(this.getFormType())}`
    const queryName = `${prefix}FormQuery`;
    const fragmentName = `${prefix}FormFragment`;

    // props received from parent component (i.e. <NovaForm/> call)
    const parentProps = this.props;
    // props to pass on to child component (i.e. <FormWithMutations />)
    const childProps = {
      formType: this.getFormType(),
      schema: this.getSchema(),
      fragmentName,
      fragment: this.getFragment(),
    }

    // if this is an edit from, load the necessary data using the withSingle HoC
    if (this.getFormType === 'edit') { 
    
      // options for the withSingle HoC
      const withSingleOptions = {
        collection: this.props.collection,
        queryName: queryName,
        fragmentName: fragmentName,
        fragment: this.getFragment(),
      }

      // create a stateless loader component that's wrapped with withSingle,
      // displays the loading state if needed, and passes on loading and document
      const Loader = props => {
        const { document, loading } = props;

        return loading ? 
          <Telescope.components.Loading /> : 
          <FormWithMutations 
            document={document}
            loading={loading}
            {...childProps}
            {...parentProps} 
          />;
      }
      Loader.displayName = `withLoader(FormWithMutations)`;
      const ComponentWithSingle = withSingle(withSingleOptions)(Loader);

      return <ComponentWithSingle documentId={this.props.documentId} />
    
    } else {
    
      return <FormWithMutations  {...childProps} {...parentProps} />
    
    }

  }

  componentWillUnmount() {
    // note: patch to cancel closeCallback given by parent
    // we clean the event by hand
    // example : the closeCallback is a function that closes a modal by calling setState, this modal being the parent of this NovaForm component
    // if this componentWillUnmount hook is triggered, that means that the modal doesn't exist anymore!
    // let's not call setState on an unmounted component (avoid no-op / memory leak)
    this.context.closeCallback = f => f;
  }

}

FormWithSingle.propTypes = {

  // main options
  collection: React.PropTypes.object,
  documentId: React.PropTypes.string, // if a document is passed, this will be an edit form
  schema: React.PropTypes.object, // usually not needed

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

FormWithSingle.defaultProps = {
  layout: "horizontal",
}

FormWithSingle.contextTypes = {
  closeCallback: React.PropTypes.func,
  intl: intlShape
}

FormWithSingle.childContextTypes = {
  autofilledValues: React.PropTypes.object,
  addToAutofilledValues: React.PropTypes.func,
  updateCurrentValue: React.PropTypes.func,
  throwError: React.PropTypes.func,
  getDocument: React.PropTypes.func
}

module.exports = compose(
  withCurrentUser,
  withApollo,
)(FormWithSingle);