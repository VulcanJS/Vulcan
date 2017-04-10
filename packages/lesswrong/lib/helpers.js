import Messages from './collections/messages/collection.js';
import Conversations from './collections/conversations/collection.js';
import Users from 'meteor/vulcan:users';
import { Utils } from 'meteor/vulcan:core';


/**
* @summary Get relative link to conversation (used only in session)
* @param {Object} conversation
**/
Conversations.getLink = (conversation) => {
  return `/inbox?select=${conversation._id}`;
};

/**
* @summary Get relative link to conversation of message (conversations are only linked to relatively)
* @param {Object} message
**/
Messages.getLink = (message) => {
  return `/inbox?select=${message.conversationId}`;
};


/**
* @summary Check whether User is subscribed to a document
* @param {Object} user
* @param {Object} document
**/
Users.isSubscribedTo = (user, document) => {

  if (!user || !document) {
    // should return an error
    return false;
  }

  const { __typename, _id: itemId } = document;
  const documentType = Utils.capitalize(Utils.getCollectionNameFromTypename(__typename));

  if (user.subscribedItems && user.subscribedItems[documentType]) {
    return !!user.subscribedItems[documentType].find(subscribedItems => subscribedItems.itemId === itemId);
  } else {
    return false;
  }
};
