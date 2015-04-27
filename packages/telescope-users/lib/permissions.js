/**
 * Telescope permissions
 * @namespace Users.can
 */
Users.can = {};

/**
 * Permissions checks.  Return true if all is well.
 * @param {Object} user - Meteor.user()
 */
Users.can.view = function (user) {
  if (Settings.get('requireViewInvite', false)) {

    if (Meteor.isClient) {
      // on client only, default to the current user
      user = (typeof user === 'undefined') ? Meteor.user() : user;
    }

    return (!!user && (Users.is.admin(user) || Users.is.invited(user)));
  }
  return true;
};

Users.can.viewPendingPosts = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return Users.is.admin(user);
};

Users.can.viewRejectedPosts = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return Users.is.admin(user);
};

Users.can.viewById = function (userId) {
  // if an invite is required to view, run permission check, else return true
  if (Settings.get('requireViewInvite', false)) {
    return !!userId ? Users.can.view(Meteor.users.findOne(userId)) : false;
  }
  return true;
};

Users.can.post = function (user, returnError) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user) {
    return returnError ? "no_account" : false;
  } else if (Users.is.admin(user)) {
    return true;
  } else if (Settings.get('requirePostInvite')) {
    if (user.isInvited) {
      return true;
    } else {
      return returnError ? "no_invite" : false;
    }
  } else {
    return true;
  }
};

Users.can.comment = function (user, returnError) {
  return Users.can.post(user, returnError);
};

Users.can.vote = function (user, returnError) {
  return Users.can.post(user, returnError);
};

Users.can.edit = function (user, item, returnError) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user || !item || (user._id !== item.userId &&
                         user._id !== item._id &&
                         !Users.is.admin(user))) {
    return returnError ? "no_rights" : false;
  } else {
    return true;
  }
};

Users.can.editField = function (user, field) {
  if (!field.editableBy || !user) {
    return false;
  }

  if (Users.is.admin(user)) {
    return field.editableBy.indexOf("admin") !== -1;
  }
  if (Users.is.owner(user)) {
    return field.editableBy.indexOf("owner") !== -1;
  }
}

Users.can.editById = function (userId, item) {
  var user = Meteor.users.findOne(userId);
  return Users.can.edit(user, item);
};

Users.can.currentUserEdit = function (item) {
  return Users.can.edit(Meteor.user(), item);
};

Users.can.invite = function (user) {
  return Users.is.invited(user) || Users.is.admin(user);
};


// this only makes sense on the client, because we set permissions relative to the current user
SimpleSchema.prototype.setPermissions = function () {
  if (Meteor.isClient) {
    var schema = this._schema;
    var user = Meteor.user();

    // loop over each field of the schema
    _.each(schema, function (field, key) {
      // if the current user cannot edit field, add autoform.omit = true
      // add exception for the "telescope" field of the user object
      if (!Users.can.editField(user, field) && key !== "telescope") {
        this[key] = _.extend(field, {autoform: {omit: true}});
      }

    });

  }
  return this;
}
