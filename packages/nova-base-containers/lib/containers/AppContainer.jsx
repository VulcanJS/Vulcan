import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";
import Events from "meteor/nova:events";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const AppContainer = (props, context) => {

  const {loading, refetch, currentUser, categories} = props.data;
  
  return <Telescope.components.App
    ready={!loading}
    currentUser={currentUser}
    categories={categories}
    events={Events}
    {...props}
  />;
};

AppContainer.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    categories: React.PropTypes.array,
    currentUser: React.PropTypes.object,
  }).isRequired,
  params: React.PropTypes.object
};

AppContainer.displayName = "AppContainer";

const AppContainerWithData = graphql(gql`
  query getAppData {
    categories {
      _id
      name
      description
      order
      slug
      image
    }
    currentUser {
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
    return {
      variables: {},
      // pollInterval: 20000,
    };
  },
})(AppContainer);

module.exports = AppContainerWithData;