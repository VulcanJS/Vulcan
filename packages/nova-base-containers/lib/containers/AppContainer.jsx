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
      nova_bio
      nova_commentCount
      nova_displayName
      nova_downvotedComments {
        itemId
        power
        votedAt
      }
      nova_downvotedPosts {
        itemId
        power
        votedAt
      }
      nova_email
      nova_emailHash
      nova_htmlBio
      nova_karma
      nova_postCount
      nova_slug
      nova_twitterUsername
      nova_upvotedComments {
        itemId
        power
        votedAt
      }
      nova_upvotedPosts {
        itemId
        power
        votedAt
      }
      nova_website
      nova_groups
      nova_notifications_users
      nova_notifications_posts
      nova_newsletter_subscribeToNewsletter
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
