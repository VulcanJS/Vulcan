import gql from 'graphql-tag';

const fragments = {
  // avatar: gql`
  //   fragment avatarUserInfo on User {
  //     _id
  //     emailHash
  //     displayName
  //     slug
  //   }
  // `,

  list: {
    name: 'usersListFragment',
    fragment: gql`
      fragment usersListFragment on User {
        _id
        username
        createdAt
        isAdmin
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
        groups
        htmlBio
        karma
        newsletter_subscribeToNewsletter
        notifications_users
        notifications_posts
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
      }
    `,
  },

  single: {
    name: 'usersSingleFragment',
    fragment: gql`
      fragment usersSingleFragment on User {
        _id
        username
        createdAt
        isAdmin
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
        groups
        htmlBio
        karma
        newsletter_subscribeToNewsletter
        notifications_users
        notifications_posts
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
      }
    `,
  },
};

export default fragments;