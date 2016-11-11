import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export default function withApp(component, options) {
  return graphql(gql`
    query getCurrentUser {
      currentUser {
        _id
        username
        createdAt
        isAdmin
        __bio
        __commentCount
        __displayName
        __downvotedComments {
          itemId
          power
          votedAt
        }
        __downvotedPosts {
          itemId
          power
          votedAt
        }
        __email
        __emailHash
        __htmlBio
        __karma
        __postCount
        __slug
        __twitterUsername
        __upvotedComments {
          itemId
          power
          votedAt
        }
        __upvotedPosts {
          itemId
          power
          votedAt
        }
        __website
        __groups
        __notifications_users
        __notifications_posts
        __newsletter_subscribeToNewsletter
      }
    }
  `, {
    options(ownProps) {
      return {
        variables: {},
        // pollInterval: 20000,
      };
    },
    props(props) {
      const {data: {loading, currentUser}} = props;
      return {
        loading,
        currentUser,
      };
    },
  })(component)
};

module.exports = withApp;