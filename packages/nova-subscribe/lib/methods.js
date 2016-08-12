import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

/**
 * @summary Verify that the un/subscription can be performed
 * @param {String} action
 * @param {Collection} collection
 * @param {String} itemId
 * @param {Object} user: current user (xxx: legacy, to replace with this.userId)
 * @returns {Object} collectionName, fields: object, item, hasSubscribedItem: boolean 
 */
const prepareSubscription = (action, collection, itemId, user) => {
  
  // get item's collection name
  const collectionName = collection._name.slice(0,1).toUpperCase() + collection._name.slice(1);
  
  // get item data
  const item = collection.findOne(itemId);

  // there no user logged in or no item, abort process
  if (!user || !item) {
    return false;
  }
  
  // edge case: Users collection
  if (collectionName === 'Users') {
    // someone can't subscribe to themself, abort process
    if (item._id === user._id) {
      return false;
    }
  } else {
    // the item's owner is the subscriber, abort process
    if (item.userId && item.userId === user._id) {
      return false;
    }
  }

  // assign the right fields depending on the collection
  let fields = { 
    subscribers: collectionName === 'Users' ? 'telescope.subscribers' : 'subscribers',
    subscriberCount: collectionName === 'Users' ? 'telescope.subscriberCount' : 'subscriberCount',
  };

  // return true if the item has the subscriber's id in its fields 
  const hasSubscribedItem = !!_.deep(item, fields['subscribers']) && _.deep(item, fields['subscribers']) && _.deep(item, fields['subscribers']).indexOf(user._id) !== -1;

  // assign the right update operator and count depending on the action type
  const updateQuery = action === 'subscribe' ? {
    findOperator: '$ne', // where 'IT' isn't...
    updateOperator: '$addToSet', // ...add 'IT' to the array...
    updateCount: 1, // ...and log the addition +1
  } : {
    findOperator: '$eq', // where 'IT' is...
    updateOperator: '$pull', // ...remove 'IT' from the array...
    updateCount: -1, // ...and log the subtraction -1
  };

  // return the utility object to pursue
  return {
    collectionName,
    fields,
    item,
    hasSubscribedItem,
    ...updateQuery,
  };
}

/**
 * @summary Perform the un/subscription after verification: update the collection item & the user
 * @param {String} action
 * @param {Collection} collection
 * @param {String} itemId
 * @param {Object} user: current user (xxx: legacy, to replace with this.userId)
 * @returns {Boolean}
 */
const performSubscriptionAction = (action, collection, itemId, user) => {

  // subscription preparation to verify if can pursue and give shorthand variables
  const subscription = prepareSubscription(action, collection, itemId, user);

  // Abort process if the situation matches one of these cases:
  // - subscription preparation failed (ex: no user, no item, subscriber is author's item, ... see all cases above)
  // - the action is subscribe but the user has already subscribed to this item
  // - the action is unsubscribe but the user hasn't subscribed to this item
  if(!subscription || (action === 'subscribe' && subscription.hasSubscribedItem) || (action === 'unsubscribe' && !subscription.hasSubscribedItem)) {
    return false; // xxx: should return exploitable error
  }

  // shorthand for useful variables
  const { collectionName, fields, item, findOperator, updateOperator, updateCount } = subscription;

  // Perform the action, eg. operate on the item's collection
  const result = collection.update({
      _id: itemId,
      // if it's a subscription, find  where there are not the user (ie. findOperator = $ne), else it will be $in
      [fields['subscribers']]: { [findOperator]: user._id }
    }, {
      // if it's a subscription, add a subscriber (ie. updateOperator = $addToSet), else it will be $pull
      [updateOperator]: { [fields['subscribers']]: user._id },
      // if it's a subscription, the count is incremented of 1, else decremented of 1
      $inc: { [fields['subscriberCount']]: updateCount },
  });

  // log the operation on the subscriber if it has succeeded
  if (result > 0) {
    // id of the item subject of the action
    let loggedItem = {
      itemId: item._id,
    };

    // in case of subscription, log also the date 
    if (action === 'subscribe') {
      loggedItem = {
        ...loggedItem,
        subscribedAt: new Date()
      };
    }

    // update the user's list of subscribed items
    Users.update({
      _id: user._id
    }, {
      [updateOperator]: { [`telescope.subscribedItems.${collectionName}`]: loggedItem }
    });

    return true; // action completed! ✅
  } else {
    return false; // xxx: should return exploitable error
  }
};

Meteor.methods({
  "posts.subscribe"(docId, userId = this.userId) {
    check(docId, String);
    check(userId, String);
    
    const currentUser = Users.findOne({_id: this.userId});
    const user = userId !== this.userId ? Users.findOne({_id: userId }) : currentUser;

    if (!Users.canDo(currentUser, "posts.subscribe") || userId !== this.userId && !Users.canDo(currentUser, "posts.subscribe.all")) {
      throw new Meteor.Error(601, "You don't have the permission to do this");
    }

    return performSubscriptionAction('subscribe', Posts, docId, user);
  },
  "posts.unsubscribe"(docId, userId = this.userId) {
    check(docId, String);
    check(userId, String);
    
    const currentUser = Users.findOne({_id: this.userId});
    const user = userId !== this.userId ? Users.findOne({_id: userId }) : currentUser;

    if (!Users.canDo(currentUser, "posts.unsubscribe") || userId !== this.userId && !Users.canDo(currentUser, "posts.unsubscribe.all")) {
      throw new Meteor.Error(601, "You don't have the permission to do this");
    }

    return performSubscriptionAction('unsubscribe', Posts, docId, Meteor.user());
  },
  "users.subscribe"(docId, userId = this.userId) {
    check(docId, String);
    check(userId, String);
    
    const currentUser = Users.findOne({_id: this.userId});
    const user = userId !== this.userId ? Users.findOne({_id: userId }) : currentUser;

    if (!Users.canDo(currentUser, "users.subscribe") || userId !== this.userId && !Users.canDo(currentUser, "users.subscribe.all")) {
      throw new Meteor.Error(601, "You don't have the permission to do this");
    }

    return performSubscriptionAction('subscribe', Users, docId, Meteor.user());
  },
  "users.unsubscribe"(docId, userId = this.userId) {
    check(docId, String);
    check(userId, String);
    
    const currentUser = Users.findOne({_id: this.userId});
    const user = userId !== this.userId ? Users.findOne({_id: userId }) : currentUser;

    if (!Users.canDo(currentUser, "users.unsubscribe") || userId !== this.userId && !Users.canDo(currentUser, "users.unsubscribe.all")) {
      throw new Meteor.Error(601, "You don't have the permission to do this");
    }

    return performSubscriptionAction('unsubscribe', Users, docId, Meteor.user());
  }
});
