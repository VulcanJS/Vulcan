'use strict';

can = {};

// Permissions

// user:                Defaults to Meteor.user()
//
// return true if all is well, false
can.view = function(user) {
  if (getSetting('requireViewInvite', false)) {

    if (Meteor.isClient) {
      // on client only, default to the current user
      user = (typeof user === 'undefined') ? Meteor.user() : user;
    }

    return (!!user && (isAdmin(user) || isInvited(user)));
  }
  return true;
};
can.viewById = function(userId) {
  // if an invite is required to view, run permission check, else return true
  if (getSetting('requireViewInvite', false)) {
    return !!userId ? can.view(Meteor.users.findOne(userId)) : false;
  }
  return true;
};
can.post = function(user, returnError) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user) {
    return returnError ? "no_account" : false;
  } else if (isAdmin(user)) {
    return true;
  } else if (getSetting('requirePostInvite')) {
    if (user.isInvited) {
      return true;
    } else {
      return returnError ? "no_invite" : false;
    }
  } else {
    return true;
  }
};
can.comment = function(user, returnError) {
  return can.post(user, returnError);
};
can.vote = function(user, returnError) {
  return can.post(user, returnError);
};
can.edit = function(user, item, returnError) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user || !item || (user._id !== item.userId && !isAdmin(user))) {
    return returnError ? "no_rights" : false;
  } else {
    return true;
  }
};
can.editById = function(userId, item) {
  var user = Meteor.users.findOne(userId);
  return can.edit(user, item);
};
can.currentUserEdit = function(item) {
  return can.edit(Meteor.user(), item);
};
can.invite = function(user) {
  return isInvited(user) || isAdmin(user);
};