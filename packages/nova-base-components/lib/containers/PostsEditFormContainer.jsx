import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PostsEditFormContainer = (props, context) => {
  const Component = props.component;

  return <Component post={props.post} flash={props.flash} novaFormMutation={props.novaFormMutation} router={props.router} />;
};

PostsEditFormContainer.propTypes = {
  flash: React.PropTypes.func,
  novaFormMutation: React.PropTypes.func,
  post: React.PropTypes.object.isRequired,
  router: React.PropTypes.object,
};

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const PostsEditFormContainerWithMutation = graphql(gql`
  mutation postsEdit($postId: String, $set: PostInput, $unset: PostUnsetModifier) {
    postsEdit(postId: $postId, set: $set, unset: $unset) {
      _id
      title
      url
      slug
      body
      htmlBody
      thumbnailUrl
      baseScore
      postedAt
      sticky
      status
      categories {
        _id
        name
        slug
      }
      commentCount
      comments {
        _id
        # note: currently not used in PostsCommentsThread
        # parentComment {
        #   htmlBody
        #   postedAt
        #   user {
        #     _id
        #     telescope {
        #       slug
        #       emailHash # used for the avatar
        #     }
        #   }
        # }
        htmlBody
        postedAt
        user {
          _id
          telescope {
            slug
            emailHash # used for the avatar
          }
        }
      }
      upvoters {
        _id
      }
      downvoters {
        _id
      }
      upvotes # should be asked only for admins?
      score # should be asked only for admins?
      viewCount # should be asked only for admins?
      clickCount # should be asked only for admins?
      user {
        _id
        telescope {
          displayName
          slug
          emailHash
        }
      }
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