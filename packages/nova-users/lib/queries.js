import Telescope from 'meteor/nova:lib';
import Users from './collection.js';

Telescope.graphQL.addQuery(`
  users: [User]
  user(_id: String, slug: String): User
  currentUser: User
`);

Users.graphQLQueries = {
  single: `
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
  `
};