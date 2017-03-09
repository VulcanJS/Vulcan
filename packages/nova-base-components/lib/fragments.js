import { registerFragment, getFragment } from 'meteor/nova:core';

// ------------------------------ Vote ------------------------------ //

// note: fragment used by default on the UsersProfile fragment
registerFragment(`
  fragment VotedItem on Vote {
    # nova:voting
    itemId
    power
    votedAt
  }
`);

// ------------------------------ Users ------------------------------ //

// note: fragment used by default on UsersProfile, PostsList & CommentsList fragments
registerFragment(`
  fragment UsersMinimumInfo on User {
    # nova:users
    _id
    slug
    username
    displayName
    emailHash
  }
`);

registerFragment(`
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
`);

// ------------------------------ Categories ------------------------------ //

// note: fragment used by default on CategoriesList & PostsList fragments
registerFragment(`
  fragment CategoriesMinimumInfo on Category {
    # nova:categories
    _id
    name
    slug
  }
`);

registerFragment(`
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
`);

// ------------------------------ Posts ------------------------------ //

registerFragment(`
  fragment PostsList on Post {
    # nova:posts
    _id
    title
    url
    slug
    postedAt
    createdAt
    sticky
    status
    body
    htmlBody
    excerpt
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
`);

registerFragment(`
  fragment PostsPage on Post {
    ...PostsList
  }
`);


// ----------------------------- Comments ------------------------------ //

registerFragment(`
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
`);
