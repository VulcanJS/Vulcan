import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const CommentsEditFormContainer = (props, context) => {
  const Component = props.component;

  return <Component post={props.post} flash={props.flash} novaFormMutation={props.novaFormMutation} router={props.router} />;
};

CommentsEditFormContainer.propTypes = {
  flash: React.PropTypes.func,
  novaFormMutation: React.PropTypes.func,
  post: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const CommentsEditFormContainerWithMutation = graphql(gql`
  mutation commentsEdit($commentId: String, $set: CommentInput, $unset: CommentUnsetModifier) {
    commentsEdit(commentId: $commentId, set: $set, unset: $unset) {
      _id
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
})(CommentsEditFormContainer);

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentsEditFormContainerWithMutation));