import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment conversationsListFragment on Conversation {
    _id
    title
    createdAt
    latestActivity
    participants {
      _id
      username
    }
  }
`);

registerFragment(`
  fragment messageListFragment on Message {
    _id
    user {
      _id
      displayName
    }
    createdAt
    messageMD
    messageHTML
    conversationId
  }
`);

registerFragment(`
  fragment editTitle on Conversation {
    title
  }
`);
