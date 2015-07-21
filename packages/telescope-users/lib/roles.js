/**
 * Telescope roles
 * @namespace Users.is
 */
Users.is = {};

/**
 * Check if a user is an admin
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

/**
 * Check if a user owns a document
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

Users.is.invited = function (userOrUserId) {
  try {
    var user = Users.getUser(userOrUserId);
    return Users.is.admin(user) || user.telescope.isInvited;
  } catch (e) {
    return false; // user not logged in
  }
};
Users.is.invitedById = Users.is.invited;

Meteor.users.helpers({
  // conflicts with user.isAdmin property
  // isAdmin: function () {
  //   return Users.is.admin(this);
  // },
  isOwner: function (document) {
    return Users.is.owner(this, document);
  },
  isInvited: function () {
    return Users.is.invited(this);
  }
});