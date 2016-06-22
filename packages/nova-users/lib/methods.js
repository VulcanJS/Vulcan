import Users from './namespace.js';

var completeUserProfile = function (userId, modifier, user) {

  Users.update(userId, modifier);

  Telescope.callbacks.runAsync("profileCompletedAsync", Users.findOne(userId));

  return Users.findOne(userId);

};

Users.methods = {};

Users.methods.edit = (userId, modifier, user) => {
  
  if (typeof user === "undefined") {
    user = Posts.findOne(userId);
  }

  // ------------------------------ Callbacks ------------------------------ //

  modifier = Telescope.callbacks.run("UsersEdit", modifier, user);

  // ------------------------------ Update ------------------------------ //

  Users.update(userId, modifier);

  // ------------------------------ Callbacks ------------------------------ //

  Telescope.callbacks.runAsync("UsersEditAsync", Users.findOne(userId), user);

  // ------------------------------ After Update ------------------------------ //
  return Users.findOne(userId);
  
}

Users.methods.setSetting = (userId, settingName, value) => {
  // all settings should be in the user.telescope namespace, so add "telescope." if needed
  var field = settingName.slice(0,10) === "telescope." ? settingName : "telescope." + settingName;

  var modifier = {$set: {}};
  modifier.$set[field] = value;

  Users.update(userId, modifier);
}

Meteor.methods({
  'users.compleProfile'(modifier, userId) {
    
    check(modifier, Match.OneOf({$set: Object}, {$unset: Object}, {$set: Object, $unset: Object}));
    check(userId, String);

    var currentUser = Meteor.user(),
        user = Users.findOne(userId),
        schema = Users.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!user || !Users.can.edit(currentUser, user)) {
      throw new Meteor.Error(601, __('sorry_you_cannot_edit_this_user'));
    }

    // if an $unset modifier is present, it means one or more of the fields is missing
    if (modifier.$unset) {
      throw new Meteor.Error(601, __('all_fields_are_required'));
    }

    // check for existing emails and throw error if necessary
    // NOTE: redundant with collection hook, but better to throw the error here to avoid wiping out the form
    if (modifier.$set && modifier.$set["telescope.email"]) {
      var email = modifier.$set["telescope.email"];
      if (Users.findByEmail(email)) {
        throw new Meteor.Error("email_taken1", __("this_email_is_already_taken") + " (" + email + ")");
      }

    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {
        var field = schema[fieldName];
        if (!Users.can.editField(user, field, user)) {
          throw new Meteor.Error("disallowed_property", __('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    completeUserProfile(userId, modifier, user);
  },

  'users.edit'(userId, modifier) {

    // checking might be redundant because SimpleSchema already enforces the schema, but you never know
    check(modifier, Match.OneOf({$set: Users.simpleSchema()}, {$unset: Object}, {$set: Users.simpleSchema(), $unset: Object}));
    check(userId, String);

    var currentUser = Meteor.user(),
        user = Users.findOne(userId),
        schema = Users.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!user || !Users.can.edit(currentUser, user)) {
      throw new Meteor.Error(601, __('sorry_you_cannot_edit_this_user'));
    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {

        var field = schema[fieldName];
        if (!Users.can.editField(currentUser, field, user)) {
          throw new Meteor.Error("disallowed_property", __('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    return Users.methods.edit(userId, modifier, user);

  },

  'users.remove'(userId, removePosts) {

    if (Users.is.adminById(this.userId)) {

      removePosts = (typeof removePosts === "undefined") ? false : removePosts;

      Meteor.users.remove(userId);

      if (removePosts) {
        var deletedPosts = Posts.remove({userId: userId});
        var deletedComments = Comments.remove({userId: userId});
        return "Deleted "+deletedPosts+" posts and "+deletedComments+" comments";
      } else {
        // not sure if anything should be done in that scenario yet
        // Posts.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
        // Comments.update({userId: userId}, {$set: {author: "\[deleted\]"}}, {multi: true});
      }
    
    }

  },

  'users.setSetting'(userId, settingName, value) {

    check(userId, String);
    check(settingName, String);
    check(value, Match.OneOf(String, Number, Boolean));

    var currentUser = Meteor.user(),
      user = Users.findOne(userId);

    // check that user can edit document
    if (!user || !Users.can.edit(currentUser, user)) {
      throw new Meteor.Error(601, __('sorry_you_cannot_edit_this_user'));
    }

    Users.methods.setSetting(userId, settingName, value);

  }

});
