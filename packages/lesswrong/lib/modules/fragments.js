import { registerFragment, extendFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment conversationsListFragment on Conversation {
    _id
    title
    createdAt
    latestActivity
    participantIds
    participants {
      ...UsersMinimumInfo
    }
  }
`);

registerFragment(`
  fragment newConversationFragment on Conversation {
    _id
    title
    participantIds
  }
`);

registerFragment(`
  fragment messageListFragment on Message {
    _id
    user {
      ...UsersMinimumInfo
    }
    createdAt
    content
    conversationId
  }
`);

registerFragment(`
  fragment editTitle on Conversation {
    _id
    title
  }
`);

registerFragment(`
  fragment notificationsNavFragment on Notification {
    _id
    userId
    createdAt
    link
    notificationMessage
    notificationType
    viewed
  }
`);

extendFragment('UsersCurrent', `
  subscribedItems
`);

registerFragment(`
  fragment RSSFeedMinimumInfo on RSSFeed {
    _id
    userId
    user {
      ...UsersMinimumInfo
    }
    createdAt
    ownedByUser
    displayFullContent
    nickname
    url
  }
`);

registerFragment(`
  fragment LWPostsList on Post {
    # vulcan:posts
    _id
    title
    url
    slug
    postedAt
    createdAt
    sticky
    status
    # body # We replaced this with content
    # htmlBody # We replaced this with content
    excerpt # This won't work with content
    # content # Our replacement for body
    lastVisitedAt
    viewCount
    clickCount
    # vulcan:users
    userId
    user {
      ...UsersMinimumInfo
    }
    # vulcan:embedly
    thumbnailUrl
    # vulcan:categories
    categories {
      ...CategoriesMinimumInfo
    }
    # vulcan:comments
    commentCount
    lastCommentedAt
    # vulcan:voting
    upvotes
    downvotes
    baseScore
    score
    feedId
    feedLink
    feed {
      ...RSSFeedMinimumInfo
    }
    nextPageTitle
    nextPageLink
    collectionTitle
  }
`);

registerFragment(`
  fragment LWPostsPage on Post {
    ...LWPostsList
    body
    htmlBody
    content
  }
`);

registerFragment(`
  fragment PostUrl on Post {
    _id
    url
    slug
  }
`);

registerFragment(`
  fragment CommentsList on Comment {
    # vulcan:comments
    _id
    postId
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    content
    postedAt
    # vulcan:users
    userId
    user {
      ...UsersMinimumInfo
    }
    # vulcan:posts
    post {
      _id
      commentCount
      commenters {
        ...UsersMinimumInfo
      }
    }
    # vulcan:voting
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
  fragment SelectCommentsList on Comment {
    ...CommentsList
    post {
      title
      _id
      commentCount
      commenters {
        ...UsersMinimumInfo
      }
      slug
    }
  }
`);

registerFragment(`
  fragment UsersList on User {
    ...UsersMinimumInfo
    karma
  }
`);

registerFragment(`
  fragment newRSSFeedFragment on RSSFeed {
    _id
    userId
    createdAt
    ownedByUser
    displayFullContent
    nickname
    url
    status
  }
`);



registerFragment(`
  fragment RSSFeedMutationFragment on RSSFeed {
    _id
    userId
    ownedByUser
    displayFullContent
    nickname
    url
  }
`);

registerFragment(`
  fragment newEventFragment on LWEvent {
    _id
    createdAt
    userId
    name
    important
    properties
    intercom
  }
`);

registerFragment(`
  fragment lastEventFragment on LWEvent {
    _id
    createdAt
    documentId
    userId
    name
    important
    properties
    intercom
  }
`);

registerFragment(`
  fragment commentWithContextFragment on Comment {
    # vulcan:comments
    _id
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    content
    postedAt
    # vulcan:users
    userId
    user {
      ...UsersMinimumInfo
    }
    # vulcan:posts
    # vulcan:voting
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
  fragment commentInlineFragment on Comment {
    # vulcan:comments
    _id
    body
    htmlBody
    content
    # vulcan:users
    userId
    user {
      ...UsersMinimumInfo
    }
  }
`);
