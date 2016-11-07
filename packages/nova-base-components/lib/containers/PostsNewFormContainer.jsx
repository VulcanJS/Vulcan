import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

const PostsNewFormContainer = (props, context) => {
  const Component = props.component;
  return <Component {...props} />
}

PostsNewFormContainer.propTypes = {
  novaFormMutation: React.PropTypes.func,
  component: React.PropTypes.func,
  successCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
  cancelCallback: React.PropTypes.func,
};

PostsNewFormContainer.displayName = "PostsNewFormContainer";

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const PostsNewFormContainerWithMutation = props => {
  console.log("PostsNewFormContainerWithMutation")
  console.log(props)

  const Component = graphql(gql`
    mutation ${props.mutation}($document: PostInput) {
      ${props.mutation}(document: $document) {
        ${props.collection.graphQLQueries.single}
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
  })(PostsNewFormContainer);

  return <Component {...props} />
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(PostsNewFormContainerWithMutation);
