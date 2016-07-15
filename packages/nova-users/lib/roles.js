import Users from './collection.js';

/**
 * @summary Telescope roles
 * @namespace Users.is
 */
Users.is = {};

/**
 * @summary Check if a user is an admin
 * @param {Object|string} userOrUserId - The user or their userId
 */
Users.is.admin = function (userOrUserId) {
  try {
    var user = Users.getUser(userOrUserId);
    return !!user && !!user.isAdmin;
  } catch (e) {
    return false; // user not logged in
  }
};
Users.is.adminById = Users.is.admin;
// use _isAdmin because there is an isAdmin property on the User schema already
Users.helpers({_isAdmin: function () {return Users.is.admin(this);}});

/**
 * @summary Check if a user owns a document
 * @param {Object|string} userOrUserId - The user or their userId
 * @param {Object} document - The document to check (post, comment, user object, etc.)
 */
Users.is.owner = function (userOrUserId, document) {
  try {
    var user = Users.getUser(userOrUserId);
    if (!!document.userId) {
      // case 1: document is a post or a comment, use userId to check
      return user._id === document.userId;
    } else {
      // case 2: document is a user, use _id to check
      return user._id === document._id;
    }
  } catch (e) {
    return false; // user not logged in
  }
};
Users.is.ownerById = Users.is.owner;
Users.helpers({isOwner: function () {return Users.is.owner(this, document);}});

/**
 * @summary Check if a user is a member or an admin
 * @param {Object} user - The user
 * @param {Object} document - The document to check (post, comment, user object, etc.)
 */
Users.is.memberOrAdmin = function (user) {
  if (typeof user === "undefined") {
    return false;
  } else {
    return !!user || Users.is.admin(user);
  }
};

/**
 * @summary Check if a user owns a document or is an admin
 * @param {Object} user - The user
 * @param {Object} document - The document to check (post, comment, user object, etc.)
 */
Users.is.ownerOrAdmin = function (user, document) {
  if (typeof user === "undefined") {
    return false;
  } else if (typeof document === "undefined") {
    return true;
  } else {
    return Users.is.owner(user, document) || Users.is.admin(user);
  }
};


Users.is.invited = function (userOrUserId) {
  try {
    var user = Users.getUser(userOrUserId);
    return Users.is.admin(user) || user.telescope.isInvited;
  } catch (e) {
    return false; // user not logged in
  }
};
Users.is.invitedById = Users.is.invited;
Users.helpers({isInvited: function () {return Users.is.invited(this);}});
