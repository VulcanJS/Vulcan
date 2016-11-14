import { createFragment } from 'apollo-client';
import gql from 'graphql-tag';
import Users from 'meteor/nova:users';

Users.fragments = {
  avatar: createFragment(gql`
    fragment avatarUserInfo on User {
      _id
      __emailHash
      __displayName
      __slug
    }
  `),
  full: createFragment(gql`
    fragment fullUserInfo on User {
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
      __groups
      __htmlBio
      __karma
      __newsletter_subscribeToNewsletter
      __notifications_users
      __notifications_posts
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
    }
  `),
};