import Users from './collection.js';
import { Utils } from 'meteor/vulcan:lib';

/**
 * @summary Users.groups object
 */
Users.groups = {};

/**
 * @summary Group class
 */
class Group {
  
  constructor() {
    this.actions = [];
  }

  can(actions) {
    actions = Array.isArray(actions) ? actions : [actions];
    this.actions = this.actions.concat(actions);
  }

  cannot(actions) {
    actions = Array.isArray(actions) ? actions : [actions];
    this.actions = _.difference(this.actions, actions);
  }

}

////////////////////
// Helpers        //
////////////////////

/**
 * @summary create a new group
 * @param {String} groupName
 */
Users.createGroup = groupName => {
  Users.groups[groupName] = new Group();
};

/**
 * @summary get a list of a user's groups
 * @param {Object} user
 */
Users.getGroups = user => {

  let userGroups = [];

  if (!user) { // guests user

    userGroups = ["guests"];
  
  } else {
  
    userGroups = ["members"];

    if (user.groups) { // custom groups
      userGroups = userGroups.concat(user.groups);
    } 
    
    if (Users.isAdmin(user)) { // admin
      userGroups.push("admins");
    }

  }

  return userGroups;

};

/**
 * @summary get a list of all the actions a user can perform
 * @param {Object} user
 */
Users.getActions = user => {
  const userGroups = Users.getGroups(user);
  const groupActions = userGroups.map(groupName => {
    // note: make sure groupName corresponds to an actual group
    const group = Users.groups[groupName];
    return group && group.actions;
  });
  return _.unique(_.flatten(groupActions));
};

/**
 * @summary check if a user is a member of a group
 * @param {Array} user 
 * @param {String} group or array of groups
 */
Users.isMemberOf = (user, groupOrGroups) => {
  const groups = Array.isArray(groupOrGroups) ? groupOrGroups : [groupOrGroups];
  
  // everybody is considered part of the guests group
  if (groups.indexOf('guests') !== -1) return true;
  
  // every logged in user is part of the members group
  if (groups.indexOf('members') !== -1) return !!user; 
  
  // the admin group have their own function
  if (groups.indexOf('admin') !== -1) return Users.isAdmin(user);

  // else test for the `groups` field
  return _.intersection(Users.getGroups(user), groups).length > 0;
};

/**
 * @summary check if a user can perform a specific action
 * @param {Object} user
 * @param {String} action
 */
Users.canDo = (user, action) => {
  return Users.getActions(user).indexOf(action) !== -1;
};

// DEPRECATED
// TODO: remove this
/**
 * @summary Check if a user can edit a document
 * @param {Object} user - The user performing the action
 * @param {Object} document - The document being edited
 */
// Users.canEdit = function (user, document) {

//   user = (typeof user === 'undefined') ? Meteor.user() : user;

//   // note(apollo): use of `__typename` given by react-apollo
//   //const collectionName = document.getCollectionName();
//   const collectionName = document.__typename ? Utils.getCollectionNameFromTypename(document.__typename) : document.getCollectionName();
  
//   if (!user || !document) {
//     return false;
//   }

//   if (document.hasOwnProperty('isDeleted') && document.isDeleted) return false;

//   if (Users.owns(user, document)) {
//     // if this is user's document, check if user can edit own documents
//     return Users.canDo(user, `${collectionName}.edit.own`);
//   } else {
//     // if this is not user's document, check if they can edit all documents
//     return Users.canDo(user, `${collectionName}.edit.all`);
//   }

// };

/**
 * @summary Check if a user owns a document
 * @param {Object|string} userOrUserId - The user or their userId
 * @param {Object} document - The document to check (post, comment, user object, etc.)
 */
Users.owns = function (user, document) {
  try {
    if (!!document.userId) {
      // case 1: document is a post or a comment, use userId to check
      return user._id === document.userId;
    } else {
      // case 2: document is a user, use _id or slug to check
      return document.slug ? user.slug === document.slug : user._id === document._id;
    }
  } catch (e) {
    return false; // user not logged in
  }
};

/**
 * @summary Check if a user is an admin
 * @param {Object|string} userOrUserId - The user or their userId
 */
Users.isAdmin = function (userOrUserId) {
  try {
    var user = Users.getUser(userOrUserId);
    return !!user && !!user.isAdmin;
  } catch (e) {
    return false; // user not logged in
  }
};
Users.isAdminById = Users.isAdmin;

/**
 * @summary Check if a user can view a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.canViewField = function (user, field, document) {
  if (field.viewableBy) {
    return typeof field.viewableBy === 'function' ? field.viewableBy(user, document) : Users.isMemberOf(user, field.viewableBy)
  }
  return false;
};

/**
 * @summary Get a list of fields viewable by a user
 * @param {Object} user - The user performing the action
 * @param {Object} collection - The collection
 * @param {Object} document - Optionally, get a list for a specific document
 */
Users.getViewableFields = function (user, collection, document) {
  return Utils.arrayToFields(_.compact(_.map(collection.simpleSchema()._schema,
    (field, fieldName) => {
      return Users.canViewField(user, field, document) ? fieldName : null;
    }
  )));
}

// collection helper
Users.helpers({
  getViewableFields(collection, document) {
    return Users.getViewableFields(this, collection, document);
  }
});

/**
 * @summary For a given document or list of documents, keep only fields viewable by current user
 * @param {Object} user - The user performing the action
 * @param {Object} collection - The collection
 * @param {Object} document - The document being returned by the resolver
 */
Users.restrictViewableFields = function (user, collection, docOrDocs) {

  if (!docOrDocs) return {};
  
  const restrictDoc = document => _.pick(document, _.keys(Users.getViewableFields(user, collection, document)));
  
  return Array.isArray(docOrDocs) ? docOrDocs.map(restrictDoc) : restrictDoc(docOrDocs);

}

/**
 * @summary Check if a user can submit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.canInsertField = function (user, field) {
  if (user && field.insertableBy) {
    return typeof field.insertableBy === 'function' ? field.insertableBy(user) : Users.isMemberOf(user, field.insertableBy)
  }
  return false;
};

/** @function
 * Check if a user can edit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.canEditField = function (user, field, document) {
  if (user && field.editableBy) {
    return typeof field.editableBy === 'function' ? field.editableBy(user, document) : Users.isMemberOf(user, field.editableBy)
  }
  return false;
};

////////////////////
// Initialize     //
////////////////////

/**
 * @summary initialize the 3 out-of-the-box groups
 */
Users.createGroup("guests"); // non-logged-in users
Users.createGroup("members"); // regular users

const membersActions = [
  "users.new", 
  "users.edit.own", 
  "users.remove.own"
];
Users.groups.members.can(membersActions);

Users.createGroup("admins"); // admin users

const adminActions = [
  "users.new", 
  "users.edit.all",
  "users.remove.all",
  "settings.edit"
];
Users.groups.admins.can(adminActions);
