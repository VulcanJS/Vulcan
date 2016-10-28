import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const UsersSingleContainer = (props, context) => {

  const {loading, user, refetch} = props.data;
  const Component = props.component

  return loading ? <Telescope.components.Loading/> : <Component 
    document={user}
    refetchQuery={refetch}
    {...props.componentProps}
  />;
};

UsersSingleContainer.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    user: React.PropTypes.object,
  }).isRequired,
  params: React.PropTypes.object
};

UsersSingleContainer.contextTypes = {
  currentUser: React.PropTypes.object
};

UsersSingleContainer.displayName = "UsersSingleContainer";

const UsersSingleContainerWithData = graphql(gql`
  query getUser($userId: String, $slug: String) {
    user(_id: $userId, slug: $slug) {
      _id
      username
      createdAt
      isAdmin
      telescope {
        bio
        commentCount
        displayName
        downvotedComments {
          itemId
          power
          votedAt
        }
        downvotedPosts {
          itemId
          power
          votedAt
        }
        email
        emailHash
        htmlBio
        karma
        postCount
        slug
        twitterUsername
        upvotedComments {
          itemId
          power
          votedAt
        }
        upvotedPosts {
          itemId
          power
          votedAt
        }
        website
        groups
        notifications_users
        notifications_posts
        newsletter_subscribeToNewsletter
      }
    }
  }
  `, {
  options(ownProps) {
    console.log(ownProps)
    return {
      variables: { userId: ownProps.userId, slug: ownProps.slug },
      pollInterval: 20000,
    };
  },
})(UsersSingleContainer);

module.exports = UsersSingleContainerWithData;