import { registerFragment, extendFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment conversationsListFragment on Conversation {
    _id
    title
    createdAt
    latestActivity
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
    draftJS
    conversationId
  }
`);

registerFragment(`
  fragment editTitle on Conversation {
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

extendFragment('PostsList', `
  draftJS
`);

registerFragment(`
  fragment PostsList on Post {
    # vulcan:posts
    _id
    title
    url
    slug
    postedAt
    createdAt
    sticky
    status
    # body # We replaced this with draftJS
    htmlBody # We replaced this with draftJS
    # excerpt # This won't work with draftJS
    draftJS # Our replacement for body
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
    commenters {
      ...UsersMinimumInfo
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

extendFragment('CommentsList', `
  draftJS
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
    rawFeed
  }
`);
