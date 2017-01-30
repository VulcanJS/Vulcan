import gql from 'graphql-tag';
import { registerFragment } from 'meteor/nova:core';

registerFragment(gql`
  fragment UsersProfile on User {
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
`);

const PostsFragment = gql`
  fragment PostsList on Post {
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
    upvotes # should be asked only for admins?
    downvotes # should be asked only for admins?
    baseScore # should be asked only for admins?
    score # should be asked only for admins?
    viewCount # should be asked only for admins?
    clickCount # should be asked only for admins?
    user {
      # ...avatarUserInfo
      _id
      displayName
      emailHash
      slug
    }
    userId
  }
`;

registerFragment(PostsFragment);
// also register the same fragment as "PostsPage"
registerFragment(PostsFragment, 'PostsPage');

registerFragment(gql`
  fragment CommentsList on Comment {
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
    post {
      _id
      commentCount
      commenters {
        _id
        displayName
        emailHash
        slug
      }
    }
    userId
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    downvotes # should be asked only for admins?
    baseScore # should be asked only for admins?
    score # should be asked only for admins?
  }
`);

registerFragment(gql`
  fragment CategoriesList on Category {
    _id
    name
    description
    order
    slug
    image
    parentId
    parent {
      _id
    }
  }
`);
