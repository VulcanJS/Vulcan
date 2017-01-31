import gql from 'graphql-tag';
import { registerFragment, getFragment } from 'meteor/nova:core';

// ------------------------------ Vote ------------------------------ //

// note: fragment used by default on the UsersProfile fragment
registerFragment(gql`
  fragment VotedItem on Vote {
    # nova:voting
    itemId
    power
    votedAt
  }
`);

// ------------------------------ Users ------------------------------ //

// note: fragment used by default on UsersProfile, PostsList & CommentsList fragments
registerFragment(gql`
  fragment UsersMinimumInfo on User {
    # nova:users
    _id
    slug
    username
    displayName
    emailHash
  }
`);

registerFragment(gql`
  fragment UsersProfile on User {
    # nova:users
    ...UsersMinimumInfo
    createdAt
    isAdmin
    bio
    htmlBio
    twitterUsername
    website
    groups
    karma
    # nova:posts
    postCount
    # nova:comments
    commentCount
    # nova:newsletter
    newsletter_subscribeToNewsletter
    # nova:notifications
    notifications_users
    notifications_posts
    # nova:voting
    downvotedComments {
      ...VotedItem
    }
    downvotedPosts {
      ...VotedItem
    }
    upvotedComments {
      ...VotedItem
    }
    upvotedPosts {
      ...VotedItem
    }
  }
  ${getFragment('UsersMinimumInfo')}
  ${getFragment('VotedItem')}
`);

// ------------------------------ Categories ------------------------------ //

// note: fragment used by default on CategoriesList & PostsList fragments
registerFragment(gql`
  fragment CategoriesMinimumInfo on Category {
    # nova:categories
    _id
    name
    slug
  }
`);

registerFragment(gql`
  fragment CategoriesList on Category {
    # nova:categories
    ...CategoriesMinimumInfo
    description
    order
    image
    parentId
    parent {
      ...CategoriesMinimumInfo
    }
  }
  ${getFragment('CategoriesMinimumInfo')}
`);

// ------------------------------ Posts ------------------------------ //

const PostsFragment = gql`
  fragment PostsList on Post {
    # nova:posts
    _id
    title
    url
    slug
    postedAt
    sticky
    status
    body
    htmlBody
    viewCount
    clickCount
    # nova:users
    userId
    user {
      ...UsersMinimumInfo
    }
    # nova:embedly
    thumbnailUrl
    # nova:categories
    categories {
      ...CategoriesMinimumInfo
    }
    # nova:comments
    commentCount
    commenters {
      ...UsersMinimumInfo
    }
    # nova:voting
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
  }
  ${getFragment('UsersMinimumInfo')}
  ${getFragment('CategoriesMinimumInfo')}
`;

registerFragment(PostsFragment);
// note: also register the same fragment as "PostsPage"
registerFragment(PostsFragment, 'PostsPage');

// ----------------------------- Comments ------------------------------ //

registerFragment(gql`
  fragment CommentsList on Comment {
    # nova:comments
    _id
    postId
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    postedAt
    # nova:users
    userId
    user {
      ...UsersMinimumInfo
    }
    # nova:posts
    post {
      _id
      commentCount
      commenters {
        ...UsersMinimumInfo
      }
    }
    # nova:voting
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
  }
  ${getFragment('UsersMinimumInfo')}
`);
