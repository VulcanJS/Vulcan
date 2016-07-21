import Users from './collection.js';

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
    actions = Array.isArray(actions) ? actions : actions;
    this.actions = this.actions.concat(actions);
  }

  cannot(actions) {
    actions = Array.isArray(actions) ? actions : actions;
    this.actions = _.difference(this.actions, actions);
  }

}

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

  if (!user) { // anonymous user

    userGroups = ["anonymous"];
  
  } else {
  
    userGroups = ["default"];

    if (user.telescope.groups) { // custom groups
      userGroups = userGroups.concat(user.telescope.groups);
    } 
    
    if (Users.is.admin(user)) { // admin
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
 * @summary check if a user can perform a specific action
 * @param {Object} user
 * @param {String} action
 */
Users.canDo = (user, action) => {
  return Users.getActions(user).indexOf(action) !== -1;
};

/**
 * @summary Check if a given user can view a specific document
 * @param {Object} user - can be undefined!
 * @param {Object} document - Note: only actually works with posts for now
 */
Users.canView = function (user, document) {

  const status = _.findWhere(Posts.config.postStatuses, {value: document.status}).label;
  const collectionName = document.getCollectionName();

  if (!document) {
    return false;
  }

  if (Users.owns(user, document)) {
    return Users.canDo(user, `${collectionName}.view.${status}.own`);
  } else {
    return Users.canDo(user, `${collectionName}.view.${status}.all`);
  }

};

/**
 * @summary Check if a user can edit a document
 * @param {Object} user - The user performing the action
 * @param {Object} document - The document being edited
 */
Users.canEdit = function (user, document) {

  user = (typeof user === 'undefined') ? Meteor.user() : user;
  const collectionName = document.getCollectionName();

  if (!user || !document) {
    return false;
  }

  if (document.hasOwnProperty('isDeleted') && document.isDeleted) return false;

  if (Users.owns(user, document)) {
    // if this is user's document, check if user can edit own documents
    return Users.canDo(user, `${collectionName}.edit.own`);
  } else {
    // if this is not user's document, check if they can edit all documents
    return Users.canDo(user, `${collectionName}.edit.all`);
  }

};

/**
 * @summary Check if a user can submit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.canSubmitField = function (user, field) {
  return user && field.insertableIf && field.insertableIf(user);
};

/** @function
 * Check if a user can edit a field – for now, identical to Users.canSubmitField 
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.canEditField = function (user, field, document) {
  return user && field.editableIf && field.editableIf(user, document);
};

/**
 * @summary initialize the 3 out-of-the-box groups
 */
Users.createGroup("anonymous"); // non-logged-in users
Users.createGroup("default"); // regular users
Users.createGroup("admins"); // admin users
