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
  `
};