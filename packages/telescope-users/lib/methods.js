var completeUserProfile = function (modifier, userId, user) {

  Users.update(userId, modifier);

  Telescope.callbacks.runAsync("profileCompletedAsync", Users.findOne(userId));

  return Users.findOne(userId);

};

Meteor.methods({
  completeUserProfile: function (modifier, userId) {
    var currentUser = Meteor.user(),
        user = Users.findOne(userId),
        schema = Users.simpleSchema()._schema;

    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!user || !Users.can.edit(currentUser, user)) {
      throw new Meteor.Error(601, i18n.t('sorry_you_cannot_edit_this_user'));
    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (operation) {
      // loop over each property being operated on
      _.keys(operation).forEach(function (fieldName) {
        console.log(fieldName);
        var field = schema[fieldName];
        if (!Users.can.editField(user, field, user)) {
          throw new Meteor.Error("disallowed_property", i18n.t('disallowed_property_detected') + ": " + fieldName);
        }

      });
    });

    completeUserProfile(modifier, userId, user);
  }
});
