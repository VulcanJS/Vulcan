Users.addField({
  fieldName: 'telescope.subscribedItems',
  fieldSchema: {
    type: Object,
    optional: true,
    blackbox: true,
    autoform: {
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'subscribers',
  fieldSchema: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Posts.addField({
  fieldName: 'subscriberCount',
  fieldSchema: {
    type: Number,
    optional: true,
    autoform: {
      omit: true
    }
  }
});

Telescope.modules.add("profileEdit", {
  template: 'user_subscribed_posts',
  order: 5
});

Telescope.modules.add("commentThreadBottom", {
  template: 'post_subscribe',
  order: 10
});

Posts.views.add("userSubscribedPosts", function (terms) {
  var user = Meteor.users.findOne(terms.userId),
      postsIds = [];

  if (user.telescope.subscribedItems && user.telescope.subscribedItems.Posts)
    postsIds = _.pluck(user.telescope.subscribedItems.Posts, "itemId");

  return {
    find: {_id: {$in: postsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
});

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

subscribeItem = function (collection, itemId, user) {
  var item = collection.findOne(itemId),
      collectionName = collection._name.slice(0,1).toUpperCase() + collection._name.slice(1);

  if (!user || !item || hasSubscribedItem(item, user))
    return false;

  // author can't subscribe item
  if (item.userId && item.userId === user._id)
    return false

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

unsubscribeItem = function (collection, itemId, user) {
  var user = Meteor.user(),
      item = collection.findOne(itemId),
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
  subscribePost: function(postId) {
    return subscribeItem.call(this, Posts, postId, Meteor.user());
  },
  unsubscribePost: function(postId) {
    return unsubscribeItem.call(this, Posts, postId, Meteor.user());
  }
});
