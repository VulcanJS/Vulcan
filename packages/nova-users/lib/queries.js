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
  `
};