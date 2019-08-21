import Users from './collection.js';
import { Utils } from 'meteor/vulcan:lib';
import intersection from 'lodash/intersection';

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
    this.actions = this.actions.concat(actions.map(a => a.toLowerCase()));
  }

  cannot(actions) {
    actions = Array.isArray(actions) ? actions : [actions];
    this.actions = _.difference(this.actions, actions.map(a => a.toLowerCase()));
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

    userGroups = ['guests'];
  
  } else {
  
    userGroups = ['members'];

    if (user.groups) { // custom groups
      userGroups = userGroups.concat(user.groups);
    } 
    
    if (Users.isAdmin(user)) { // admin
      userGroups.push('admins');
    }

  }

  return userGroups;

};

/**
 * @summary get a list of all the actions a user can perform
 * @param {Object} user
 */
Users.getActions = user => {
  let userGroups = Users.getGroups(user);
  if (!userGroups.includes('guests')) {
    // always give everybody permission for guests actions, too
    userGroups.push('guests');
  }
  let groupActions = userGroups.map(groupName => {
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
  return intersection(Users.getGroups(user), groups).length > 0;
};

/**
 * @summary check if a user can perform at least one of the specified actions
 * @param {Object} user
 * @param {String/Array} action or actions
 */
Users.canDo = (user, actionOrActions) => {
  const authorizedActions = Users.getActions(user);
  const actions = Array.isArray(actionOrActions) ? actionOrActions : [actionOrActions];
  return Users.isAdmin(user) || intersection(authorizedActions, actions).length > 0;
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

export const isAdmin = Users.isAdmin;

/**
 * @summary Check if a user can view a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
 Users.canReadField = function (user, field, document) {
   const canRead = field.canRead || field.viewableBy; //OpenCRUD backwards compatibility
   if (canRead) {
     if (typeof canRead === 'function') {
       // if canRead is a function, execute it with user and document passed. it must return a boolean
       return canRead(user, document);
     } else if (typeof canRead === 'string') {
       // if canRead is just a string, we assume it's the name of a group and pass it to isMemberOf
       return canRead === 'guests' || Users.isMemberOf(user, canRead);
     } else if (Array.isArray(canRead) && canRead.length > 0) {
       // if canRead is an array, we do a recursion on every item and return true if one of the items return true
       return canRead.some(group => Users.canReadField(user, { canRead: group }, document));
    }
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
      if (fieldName.indexOf('.$') > -1) return null;
      return Users.canReadField(user, field, document) ? fieldName : null;
    }
  )));
};

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

  const restrictDoc = document => {

    // get array of all keys viewable by user
    const viewableKeys = _.keys(Users.getViewableFields(user, collection, document));
    const restrictedDocument = _.clone(document);
    
    // loop over each property in the document and delete it if it's not viewable
    _.forEach(restrictedDocument, (value, key) => {
      if (!viewableKeys.includes(key)) {
        delete restrictedDocument[key];
      }
    });
  
    return restrictedDocument;
  
  };
  
  return Array.isArray(docOrDocs) ? docOrDocs.map(restrictDoc) : restrictDoc(docOrDocs);

};

/**
 * @summary Check if a user can submit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.canCreateField = function (user, field) {
  const canCreate = field.canCreate || field.insertableBy; //OpenCRUD backwards compatibility
  if (canCreate) {
    if (typeof canCreate === 'function') {
      // if canCreate is a function, execute it with user and document passed. it must return a boolean
      return canCreate(user);
    } else if (typeof canCreate === 'string') {
      // if canCreate is just a string, we assume it's the name of a group and pass it to isMemberOf
      // note: if canCreate is 'guests' then anybody can create it
      return canCreate === 'guests' || Users.isMemberOf(user, canCreate);
    } else if (Array.isArray(canCreate) && canCreate.length > 0) {
      // if canCreate is an array, we do a recursion on every item and return true if one of the items return true
      return canCreate.some(group => Users.canCreateField(user, { canCreate: group }));
    }
  }
  return false;
};

/** @function
 * Check if a user can edit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 * @param {Object} document - The document being edited or inserted
 */
Users.canUpdateField = function (user, field, document) {
  const canUpdate = field.canUpdate || field.editableBy; //OpenCRUD backwards compatibility

  if (canUpdate) {
    if (typeof canUpdate === 'function') {
      // if canUpdate is a function, execute it with user and document passed. it must return a boolean
      return canUpdate(user, document);
    } else if (typeof canUpdate === 'string') {
      // if canUpdate is just a string, we assume it's the name of a group and pass it to isMemberOf
      // note: if canUpdate is 'guests' then anybody can create it
      return canUpdate === 'guests' || Users.isMemberOf(user, canUpdate);
    } else if (Array.isArray(canUpdate) && canUpdate.length > 0) {
      // if canUpdate is an array, we look at every item and return true if one of the items return true
      return canUpdate.some(group => Users.canUpdateField(user, { canUpdate: group }, document));

    }
  }
  return false;
};

////////////////////
// Initialize     //
////////////////////

/**
 * @summary initialize the 3 out-of-the-box groups
 */
Users.createGroup('guests'); // non-logged-in users
Users.createGroup('members'); // regular users

const membersActions = [
  'user.create', 
  'user.update.own', 
  // OpenCRUD backwards compatibility
  'users.new', 
  'users.edit.own', 
  'users.remove.own',
];
Users.groups.members.can(membersActions);

Users.createGroup('admins'); // admin users

const adminActions = [
  'user.create', 
  'user.update.all',
  'user.delete.all',
  'setting.update',
  // OpenCRUD backwards compatibility
  'users.new', 
  'users.edit.all',
  'users.remove.all',
  'settings.edit',
];
Users.groups.admins.can(adminActions);
