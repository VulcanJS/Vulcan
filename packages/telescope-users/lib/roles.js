/**
 * Telescope roles
 * @namespace Users.is
 */
Users.is = {};

getUser = function (userOrUserId) {
  if (typeof userOrUserId === "undefined") {
    if (!Meteor.user()) {
      throw new Error();
    } else {
      return Meteor.user();
    }
  } else if (typeof userOrUserId === "string") {
    return Meteor.users.findOne(userOrUserId);
  } else {
    return userOrUserId;
  }
}

Users.is.admin = function (userOrUserId) {
  try {
    var user = getUser(userOrUserId);
    return !!user && !!user.isAdmin;
  } catch (e) {
    return false; // user not logged in
  }
};
Users.is.adminById = Users.is.admin;

Users.is.owner = function (userOrUserId, document) {
  try {
    var user = getUser(userOrUserId);
    return user._id === document.userId;
  } catch (e) {
    return false; // user not logged in
  }
};
Users.is.ownerById = Users.is.owner;

Users.is.invited = function (userOrUserId) {
  try {
    var user = getUser(userOrUserId);
    return Users.is.admin(user) || Users.is.invited(user);
  } catch (e) {
    return false; // user not logged in
  }
};
Users.is.invitedById = Users.is.invited;

Meteor.users.helpers({
  isAdmin: function() {
    return Users.is.admin(this);
  },
  isOwner: function() {
    return Users.is.owner(this);
  },
  isInvited: function() {
    return Users.is.invited(this);
  }
});