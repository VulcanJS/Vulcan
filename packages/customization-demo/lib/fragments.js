import { registerFragment } from 'meteor/nova:lib';
import gql from 'graphql-tag';

const CustomPostsListFragment = gql`
  fragment CustomPostsList on Post {
    _id
    title
    url
    slug
    thumbnailUrl
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
      displayName
      emailHash
      slug
    }
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes
    downvotes
    baseScore
    score
    viewCount
    clickCount
    user {
      # ...avatarUserInfo
      _id
      displayName
      emailHash
      slug
    }
    userId
    color # new custom property!
  }
`;

registerFragment(CustomPostsListFragment, 'PostsList');
registerFragment(CustomPostsListFragment, 'PostsPage');
