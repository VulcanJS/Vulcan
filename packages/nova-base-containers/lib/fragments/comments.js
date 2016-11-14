import { createFragment } from 'apollo-client';
import gql from 'graphql-tag';
import Comments from 'meteor/nova:comments';
import Users from 'meteor/nova:users';

Comments.fragments = {
  full: createFragment(gql`
    fragment fullCommentInfo on Comment {
      _id
      postId
      parentCommentId
      topLevelCommentId
      body
      htmlBody
      postedAt
      user {
        _id
        __displayName
        __emailHash
        __slug
      }
    }
  `/*, Users.fragments.avatar*/),
};