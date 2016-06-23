import Users from './collection.js';

// note: using collection helpers here is probably a bad idea, 
// because they'll throw an error when the user is undefined

/**
 * @summary Telescope permissions
 * @namespace Users.can
 */
Users.can = {};

/**
 * @summary Check if a given user has access to view posts
 * @param {Object} user
 */
Users.can.view = function (user) {
  if (Telescope.settings.get('requireViewInvite', false)) {

    if (Meteor.isClient) {
      // on client only, default to the current user
      user = (typeof user === 'undefined') ? Meteor.user() : user;
    }

    return (!!user && (Users.is.admin(user) || Users.is.invited(user)));
  }
  return true;
};
Users.helpers({canView: function () {return Users.can.view(this);}});

/**
 * @summary Check if a given user can view a specific post
 * @param {Object} user
 * @param {Object} post
 */
Users.can.viewById = function (userId) {
  // if an invite is required to view, run permission check, else return true
  if (Telescope.settings.get('requireViewInvite', false)) {
    return !!userId ? Users.can.view(Meteor.users.findOne(userId)) : false;
  }
  return true;
};
Users.helpers({canViewById: function () {return Users.can.viewById(this);}});

/**
 * @summary Check if a given user has permission to submit new posts
 * @param {Object} user
 */
Users.can.post = function (user) {

  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user) { // no account
    return false;
  } 

  if (Users.is.admin(user)) { //admin
    return true;
  } 

  if (Telescope.settings.get('requirePostInvite', false)) { // invite required?
    if (user.isInvited()) { // invited user
      return true;
    } else { // not invited
      return false;
    }
  } else {
    return true;
  }
};
Users.helpers({canPost: function () {return Users.can.post(this);}});

/**
 * @summary Check if a given user has permission to comment (same as posting for now)
 * @param {Object} user
 */
Users.can.comment = function (user) {
  return Users.can.post(user);
};
Users.helpers({canComment: function () {return Users.can.comment(this);}});

/**
 * @summary Check if a user has permission to vote (same as posting for now)
 * @param {Object} user
 */
Users.can.vote = function (user) {
  return Users.can.post(user);
};
Users.helpers({canVote: function () {return Users.can.vote(this);}});

/**
 * @summary Check if a user can edit a document
 * @param {Object} user - The user performing the action
 * @param {Object} document - The document being edited
 */
Users.can.edit = function (user, document) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user || !document) {
    return false;
  }

  if (document.hasOwnProperty('isDeleted') && document.isDeleted) return false;

  var adminCheck = Users.is.admin(user);
  var ownerCheck = Users.is.owner(user, document);

  return adminCheck || ownerCheck;
};
Users.helpers({canEdit: function (document) {return Users.can.edit(this, document);}});

Users.can.editById = function (userId, document) {
  var user = Meteor.users.findOne(userId);
  return Users.can.edit(user, document);
};
Users.helpers({canEditById: function (document) {return Users.can.editById(this, document);}});

/**
 * @summary Check if a user can submit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.can.submitField = function (user, field) {
  return user && field.insertableIf && field.insertableIf(user);
};
Users.helpers({canSubmitField: function (field) {return Users.can.submitField(this, field);}});

/** @function
 * Check if a user can edit a field – for now, identical to Users.can.submitField
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.can.editField = function (user, field, document) {
  return user && field.editableIf && field.editableIf(user, document);
};

Users.can.invite = function (user) {
  return Users.is.invited(user) || Users.is.admin(user);
};
Users.helpers({canInvite: function () {return Users.can.invite(this);}});

