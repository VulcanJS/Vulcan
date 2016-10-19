import Telescope from 'meteor/nova:lib';
import React from 'react';
import { DocumentContainer } from "meteor/utilities:react-list-container";
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const PostsSingle = (props, context) => {

  const {loading, post} = props.data;

  return loading ? <Telescope.components.Loading/> : <Telescope.components.PostsPage post={post} />;
};

PostsSingle.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    post: React.PropTypes.object,
  }).isRequired,
  params: React.PropTypes.object
};

PostsSingle.contextTypes = {
  currentUser: React.PropTypes.object
};

const PostsSingleWithData = graphql(gql`
  query getPost($postId: String) {
    post(_id: $postId) {
      _id
      title
      url
      slug
      htmlBody
      thumbnailUrl
      baseScore
      postedAt
      comments {
        parentComment {
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
      commentCount
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
  options(ownProps) {
    return {
      variables: { postId: ownProps.params._id } 
    };
  },
})(PostsSingle);

PostsSingle.displayName = "PostsSingle";

module.exports = PostsSingleWithData;