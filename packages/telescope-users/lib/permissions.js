// note: using collection helpers here is probably a bad idea, 
// because they'll throw an error when the user is undefined

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
Users.helpers({canView: function () {return Users.can.view(this);}});


Users.can.viewById = function (userId) {
  // if an invite is required to view, run permission check, else return true
  if (Settings.get('requireViewInvite', false)) {
    return !!userId ? Users.can.view(Meteor.users.findOne(userId)) : false;
  }
  return true;
};
Users.helpers({canViewById: function () {return Users.can.viewById(this);}});

Users.can.viewPendingPosts = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return Users.is.admin(user);
};

Users.can.viewPendingPost = function (user, post) {
  return Users.is.owner(user, post) || Users.can.viewPendingPosts(user);
};

Users.can.viewRejectedPosts = function (user) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;
  return Users.is.admin(user);
};

Users.can.viewRejectedPost = function (user, post) {
  return Users.is.owner(user, post) || Users.can.viewRejectedPosts(user);
};

Users.can.post = function (user, returnError) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user) {
    return returnError ? "no_account" : false;
  } else if (Users.is.admin(user)) {
    return true;
  } else if (Settings.get('requirePostInvite')) {
    if (user.telescope.isInvited) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};
Users.helpers({canPost: function () {return Users.can.post(this);}});

Users.can.comment = function (user, returnError) {
  return Users.can.post(user, returnError);
};
Users.helpers({canComment: function () {return Users.can.comment(this);}});

Users.can.vote = function (user, returnError) {
  return Users.can.post(user, returnError);
};
Users.helpers({canVote: function () {return Users.can.vote(this);}});

/**
 * Check if a user can edit a document
 * @param {Object} user - The user performing the action
 * @param {Object} document - The document being edited
 */
Users.can.edit = function (user, document) {
  user = (typeof user === 'undefined') ? Meteor.user() : user;

  if (!user || !document) {
    return false;
  }

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
 * Check if a user can submit a field
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.can.submitField = function (user, field) {

  if (!field.editableBy || !user) {
    return false;
  }

  var adminCheck = _.contains(field.editableBy, "admin") && Users.is.admin(user); // is the field editable by admins?
  var memberCheck = _.contains(field.editableBy, "member"); // is the field editable by regular users?

  return adminCheck || memberCheck;

};
Users.helpers({canSubmitField: function (field) {return Users.can.submitField(this, field);}});

/** @function
 * Check if a user can edit a field – for now, identical to Users.can.submitField
 * @param {Object} user - The user performing the action
 * @param {Object} field - The field being edited or inserted
 */
Users.can.editField = Users.can.submitField;

Users.can.invite = function (user) {
  return Users.is.invited(user) || Users.is.admin(user);
};
Users.helpers({canInvite: function () {return Users.can.invite(this);}});

