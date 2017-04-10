import Conversations from "./collection.js"

// notifications for a specific user (what you see in the notifications menu)
Conversations.addView("userConversations", function (terms) {
  return {
    selector: {participantIds: terms.userId},
    options: {sort: {latestActivity: -1}}
  };
});
