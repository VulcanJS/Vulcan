var completeUserProfile = function (modifier, userId, user) {

  Users.update(userId, modifier);

  Telescope.callbacks.runAsync("profileCompletedAsync", Users.findOne(userId));

  return Users.findOne(userId);

};

Meteor.methods({
  completeUserProfile: function (modifier, userId) {
    
    check(modifier, Match.OneOf({$set: Object}, {$unset: Object}, {$set: Object, $unset: Object}));
    check(userId, String);

    var currentUser = Meteor.user(),
        user = Users.findOne(userId),
        schema = Users.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!user || !Users.can.edit(currentUser, user)) {
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_user'));
    }

    // if an $unset modifier is present, it means one or more of the fields is missing
    if (modifier.$unset) {
      throw new Meteor.Error(601, i18n.t('all_fields_are_required'));
    }

    // check for existing emails and throw error if necessary
    // NOTE: redundant with collection hook, but better to throw the error here to avoid wiping out the form
    if (modifier.$set && modifier.$set["telescope.email"]) {
      var email = modifier.$set["telescope.email"];
      if (Users.findByEmail(email)) {
        throw new Meteor.Error("email_taken1", i18n.t("this_email_is_already_taken") + " (" + email + ")");
      }

    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {
        var field = schema[fieldName];
        if (!Users.can.editField(user, field, user)) {
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    completeUserProfile(modifier, userId, user);
  },

  removeUser: function (userId, removePosts) {

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

  }

});
