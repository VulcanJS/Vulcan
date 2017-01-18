import gql from 'graphql-tag';

const fragments = {
  
  list: {
    name: 'commentsListFragment',
    fragment: gql`
      fragment commentsListFragment on Comment {
        _id
        postId
        parentCommentId
        topLevelCommentId
        body
        htmlBody
        postedAt
        user {
          _id
          displayName
          emailHash
          slug
        }
      }
    `,
  },

  // not really needed 🤔
  single: {
    name: 'commentsSingleFragment',
    fragment: gql`
      fragment commentsSingleFragment on Comment {
        _id
        postId
        parentCommentId
        topLevelCommentId
        body
        htmlBody
        postedAt
        user {
          _id
          displayName
          emailHash
          slug
        }
      }
    `,
  },
};

export default fragments;