/*
This component wraps FormWrapper with a mutation that submits the form.

The mutation can either be one that inserts a new document, or one
that updates an existing document. 

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';
import FormWrapper from './FormWrapper.jsx';

// const mapStateToProps = state => ({ messages: state.messages });
// const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);


const FormWithMutation = props => {

  let ComponentWithMutation;
  const collectionName = props.collection._name;

  // create new component by wrapping FormWrapper with mutation
  if (props.document) {

    // edit document mutation
    ComponentWithMutation = graphql(gql`
      mutation ${props.mutationName}($documentId: String, $set: ${collectionName}Input, $unset: ${collectionName}Unset) {
        ${props.mutationName}(documentId: $documentId, set: $set, unset: $unset) {
          ${props.fragment ? `...${props.fragment[0].name.value}` : props.resultQuery}
        }
      }
    `, {
      options: (props) => props.fragment ? {fragments: props.fragment} : {},
      props: ({ownProps, mutate}) => ({
        mutation: ({documentId, set, unset}) => {
          return mutate({ 
            variables: {documentId: documentId, set, unset}
          })
        }
      }),
    })(FormWrapper);

  } else {

    // new document mutation
    ComponentWithMutation = graphql(gql`
      mutation ${props.mutationName}($document: ${collectionName}Input) {
        ${props.mutationName}(document: $document) {
          ${props.fragment ? `...${props.fragment[0].name.value}` : props.resultQuery}
        }
      }
    `, {
      options: (props) => props.fragment ? {fragments: props.fragment} : {},
      props: ({ownProps, mutate}) => ({
        mutation: ({document}) => {
          return mutate({ 
            variables: {document: document},
            updateQueries: props.updateQueries // needed for new document form only
          })
        }
      }),
    })(FormWrapper);
  }

  const {mutationName, updateQueries, ...rest} = props;
  
  return <ComponentWithMutation {...rest} />
};

FormWithMutation.propTypes = {

  // main options
  collection: React.PropTypes.object,
  document: React.PropTypes.object, // if a document is passed, this will be an edit form
  schema: React.PropTypes.object, // usually not needed

  // graphQL
  mutationName: React.PropTypes.string, // the mutation name
  resultQuery: React.PropTypes.string, // the results to get back
  updateQueries: React.PropTypes.object, // how to update queries

  // form
  labelFunction: React.PropTypes.func,
  prefilledProps: React.PropTypes.object,
  layout: React.PropTypes.string,
  fields: React.PropTypes.arrayOf(React.PropTypes.string),

  // callbacks
  submitCallback: React.PropTypes.func,
  successCallback: React.PropTypes.func,
  errorCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func,

}

module.exports = FormWithMutation;