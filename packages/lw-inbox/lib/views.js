import { Conversations, Messages } from "./collection.js"

// notifications for a specific user (what you see in the notifications menu)
Conversations.addView("userConversations", function (terms) {
  return {
    selector: {participantIds: terms.userId},
    options: {sort: {latestActivity: -1}}
  };
});

Messages.addView("messagesConversation", function (terms) {
  return {
    selector: {conversationId: terms.conversationId},
    options: {sort: {createdAt: 1}}
  };
});
