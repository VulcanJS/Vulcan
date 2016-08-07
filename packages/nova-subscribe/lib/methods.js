import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

var hasSubscribedItem = function (item, user) {
  return item.subscribers && item.subscribers.indexOf(user._id) != -1;
};

var addSubscribedItem = function (userId, item, collectionName) {
  var field = 'telescope.subscribedItems.' + collectionName;
  var add = {};
  add[field] = item;
  Meteor.users.update({_id: userId}, {
    $addToSet: add
  });
};

var removeSubscribedItem = function (userId, itemId, collectionName) {
  var field = 'telescope.subscribedItems.' + collectionName;
  var remove = {};
  remove[field] = {itemId: itemId};
  Meteor.users.update({_id: userId}, {
    $pull: remove
  });
};

export var subscribeItem = function (collection, itemId, user) {

  var item = collection.findOne(itemId),
      collectionName = collection._name.slice(0,1).toUpperCase() + collection._name.slice(1);

  if (!user || !item || hasSubscribedItem(item, user))
    return false;

  // author can't subscribe item
  if (item.userId && item.userId === user._id)
    return false;

  // Subscribe
  var result = collection.update({_id: itemId, subscribers: { $ne: user._id }}, {
    $addToSet: {subscribers: user._id},
    $inc: {subscriberCount: 1}
  });

  if (result > 0) {
    // Add item to list of subscribed items
    var obj = {
      itemId: item._id,
      subscribedAt: new Date()
    };
    addSubscribedItem(user._id, obj, collectionName);
  }

  return true;
};

export var unsubscribeItem = function (collection, itemId, user) {

  var item = collection.findOne(itemId),
      collectionName = collection._name.slice(0,1).toUpperCase()+collection._name.slice(1);

  if (!user || !item  || !hasSubscribedItem(item, user))
    return false;

  // Unsubscribe
  var result = collection.update({_id: itemId, subscribers: user._id }, {
    $pull: {subscribers: user._id},
    $inc: {subscriberCount: -1}
  });

  if (result > 0) {
    // Remove item from list of subscribed items
    removeSubscribedItem(user._id, itemId, collectionName);
  }
  return true;
};

Meteor.methods({
  "posts.subscribe": function(postId) {
    check(postId, String);
    return subscribeItem.call(this, Posts, postId, Meteor.user());
  },
  "posts.unsubscribe": function(postId) {
    check(postId, String);
    return unsubscribeItem.call(this, Posts, postId, Meteor.user());
  }
});
