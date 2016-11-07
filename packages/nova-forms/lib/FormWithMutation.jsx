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
  console.log("FormWithMutation")
  console.log(props)

  // create new component by wrapping FormWrapper with mutation
  const ComponentWithMutation = graphql(gql`
    mutation ${props.mutationName}($document: PostInput) {
      ${props.mutationName}(document: $document) {
        ${props.resultQuery}
      }
    }
  `, {
    props: ({ownProps, mutate}) => ({
      mutation: ({document}) => {
        return mutate({ 
          variables: {document: document},
          updateQueries: props.updateQueries
        })
      }
    }),
  })(FormWrapper);

  const {mutationName, updateQueries, ...rest} = props;
  
  return <ComponentWithMutation {...rest} />
};

FormWithMutation.propTypes = {
  collection: React.PropTypes.object,
  schema: React.PropTypes.object,
  document: React.PropTypes.object, // if a document is passed, this will be an edit form
  submitCallback: React.PropTypes.func,
  successCallback: React.PropTypes.func,
  errorCallback: React.PropTypes.func,
  mutationName: React.PropTypes.string,
  labelFunction: React.PropTypes.func,
  prefilledProps: React.PropTypes.object,
  layout: React.PropTypes.string,
  cancelCallback: React.PropTypes.func,
  resultQuery: React.PropTypes.string,
  fields: React.PropTypes.arrayOf(React.PropTypes.string)
}

module.exports = FormWithMutation;