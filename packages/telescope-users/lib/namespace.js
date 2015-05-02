/**
 * Telescope Users namespace
 * @namespace Users
 */
Users = Meteor.users;

Users.getUser = function (userOrUserId) {
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
};
