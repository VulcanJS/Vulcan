import Telescope from 'meteor/nova:lib';
import React from 'react';
import Posts from "meteor/nova:posts";
import Events from "meteor/nova:events";

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const AppContainer = (props, context) => {

  const {loading, currentUser} = props.data;

  return <Telescope.components.App
    loading={loading}
    currentUser={currentUser}
    events={Events}
    {...props}
  />;
};

AppContainer.propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    currentUser: React.PropTypes.object,
  }).isRequired,
  params: React.PropTypes.object
};

AppContainer.displayName = "AppContainer";

const AppContainerWithData = graphql(gql`
  query getAppData {
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
})(AppContainer);

module.exports = AppContainerWithData;
