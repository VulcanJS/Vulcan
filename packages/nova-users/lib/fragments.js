import gql from 'graphql-tag';

const fragments = {
  // avatar: gql`
  //   fragment avatarUserInfo on User {
  //     _id
  //     __emailHash
  //     __displayName
  //     __slug
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
    `,
  },
};

export default fragments;