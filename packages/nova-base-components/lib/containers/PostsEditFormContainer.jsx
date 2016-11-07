import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import Posts from "meteor/nova:posts";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PostsEditFormContainer = (props, context) => {
  const Component = props.component;

  return <Component {...props} />;
};

PostsEditFormContainer.propTypes = {
  flash: React.PropTypes.func,
  novaFormMutation: React.PropTypes.func,
  post: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
  component: React.PropTypes.func,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func,
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const PostsEditFormContainerWithMutation = graphql(gql`
  mutation postsEdit($postId: String, $set: PostInput, $unset: PostUnsetModifier) {
    postsEdit(postId: $postId, set: $set, unset: $unset) {
      ${Posts.graphQLQueries.single}
    }
  }
`, {
  props: ({ownProps, mutate}) => ({
    novaFormMutation: ({documentId, set, unset}) => {
      return mutate({ 
        variables: {postId: documentId, set, unset},
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   postsEdit: {
        //     __typename: 'Post',
        //     ...set
        //   }
        // },
      })
    }
  }),
})(PostsEditFormContainer);

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(PostsEditFormContainerWithMutation));