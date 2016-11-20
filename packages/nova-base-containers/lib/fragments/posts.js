import { createFragment } from 'apollo-client';
import gql from 'graphql-tag';
import Posts from 'meteor/nova:posts';
import Users from 'meteor/nova:users';

Posts.fragments = {
  list: createFragment(gql` 
    # what name convention for the fragments??
    fragment postInfoInList on Post {
      _id
      title
      url
      body
      htmlBody
      slug
      thumbnailUrl
      baseScore
      postedAt
      sticky
      status
      categories {
        # ...minimumCategoryInfo
        _id
        name
        slug
      }
      commentCount
      commenters {
        # ...avatarUserInfo
        _id
        __displayName
        __emailHash
        __slug
      }
      upvoters {
        _id
      }
      downvoters {
        _id
      }
      upvotes # should be asked only for admins?
      score # should be asked only for admins?
      viewCount # should be asked only for admins?
      clickCount # should be asked only for admins?
      user {
        # ...avatarUserInfo
        _id
        __displayName
        __emailHash
        __slug
      }
    }
  `/*, Users.fragments.avatar*/),
}