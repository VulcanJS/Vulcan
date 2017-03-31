import { Messages, Conversations } from './collection.js';
import Users from 'meteor/vulcan:users';
import { addCallback, editMutation} from 'meteor/vulcan:core';

const updateConversationActivity = (message) => {
  // Update latest Activity timestamp on conversation when new message is added
  const user = Users.findOne(message.userId);
  const conversation = Conversations.findOne(message.conversationId);
  editMutation({
    collection: Conversations,
    documentId: conversation._id,
    set: {latestActivity: message.createdAt},
    currentUser: user,
    validate: false,
  });
};
addCallback("messages.new.async", updateConversationActivity);
