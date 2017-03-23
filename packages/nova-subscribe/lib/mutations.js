import Users from 'meteor/vulcan:users';
import { Utils, GraphQLSchema } from 'meteor/vulcan:core';

/**
 * @summary Verify that the un/subscription can be performed
 * @param {String} action
 * @param {Collection} collection
 * @param {String} itemId
 * @param {Object} user
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
    if (item.userId && item.userId === user._id) {
      return false;
    }
  }

  // assign the right fields depending on the collection
  const fields = {
    subscribers: 'subscribers',
    subscriberCount: 'subscriberCount',
  };

  // return true if the item has the subscriber's id in its fields
  const hasSubscribedItem = !!_.deep(item, fields.subscribers) && _.deep(item, fields.subscribers) && _.deep(item, fields.subscribers).indexOf(user._id) !== -1;

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
};

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
  if (!subscription || (action === 'subscribe' && subscription.hasSubscribedItem) || (action === 'unsubscribe' && !subscription.hasSubscribedItem)) {
    throw Error(Utils.encodeIntlError({id: 'app.mutation_not_allowed', value: 'Already subscribed'}))
  }

  // shorthand for useful variables
  const { collectionName, fields, item, findOperator, updateOperator, updateCount } = subscription;

  // Perform the action, eg. operate on the item's collection
  const result = collection.update({
    _id: itemId,
    // if it's a subscription, find  where there are not the user (ie. findOperator = $ne), else it will be $in
    [fields.subscribers]: { [findOperator]: user._id }
  }, {
    // if it's a subscription, add a subscriber (ie. updateOperator = $addToSet), else it will be $pull
    [updateOperator]: { [fields.subscribers]: user._id },
    // if it's a subscription, the count is incremented of 1, else decremented of 1
    $inc: { [fields.subscriberCount]: updateCount },
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
      [updateOperator]: { [`subscribedItems.${collectionName}`]: loggedItem }
    });

    const updatedUser = Users.findOne({_id: user._id}, {fields: {_id:1, subscribedItems: 1}});
    
    return updatedUser;
  } else {
    throw Error(Utils.encodeIntlError({id: 'app.something_bad_happened'}))
  }
};

/**
 * @summary Generate mutations 'collection.subscribe' & 'collection.unsubscribe' automatically
 * @params {Array[Collections]} collections
 */
 const subscribeMutationsGenerator = (collection) => {

   // generic mutation function calling the performSubscriptionAction
   const genericMutationFunction = (collectionName, action) => {
     // return the method code
     return function(root, { documentId }, context) {
       
       // extract the current user & the relevant collection from the graphql server context
       const { currentUser, [Utils.capitalize(collectionName)]: collection } = context;
       
       // permission check
       if (!Users.canDo(context.currentUser, `${collectionName}.${action}`)) {
         throw new Error(Utils.encodeIntlError({id: "app.noPermission"}));
       }
       
       // do the actual subscription action
       return performSubscriptionAction(action, collection, documentId, currentUser);
     };
   };

   const collectionName = collection._name;
   
   // add mutations to the schema
   GraphQLSchema.addMutation(`${collectionName}Subscribe(documentId: String): User`),
   GraphQLSchema.addMutation(`${collectionName}Unsubscribe(documentId: String): User`);
   
   // create an object of the shape expected by mutations resolvers
   GraphQLSchema.addResolvers({
     Mutation: {
       [`${collectionName}Subscribe`]: genericMutationFunction(collectionName, 'subscribe'),
       [`${collectionName}Unsubscribe`]: genericMutationFunction(collectionName, 'unsubscribe'),
     },
   });
   
   
 };

// Finally. Add the mutations to the Meteor namespace 🖖

// vulcan:users is a dependency of this package, it is alreay imported
subscribeMutationsGenerator(Users);


// note: leverage weak dependencies on packages
const Posts = Package['vulcan:posts'] ? Package['vulcan:posts'].default : null;
// check if vulcan:posts exists, if yes, add the mutations to Posts
if (!!Posts) {
  subscribeMutationsGenerator(Posts);
}

// check if vulcan:categories exists, if yes, add the mutations to Categories
const Categories = Package['vulcan:categories'] ? Package['vulcan:categories'].default : null;
if (!!Categories) {
  subscribeMutationsGenerator(Categories);
}

export default subscribeMutationsGenerator;
