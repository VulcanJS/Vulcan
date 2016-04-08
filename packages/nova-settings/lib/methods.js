Meteor.methods({

  'settings.insert'(modifier) {

    const schema = Telescope.settings.collection.simpleSchema()._schema;
    // checking might be redundant because SimpleSchema already enforces the schema, but you never know
    //var match = Match.OneOf({$set: schema}, {$unset: Object}, {$set: schema, $unset: Object});
    //
    //console.log(modifier, match);
    //
    //check(modifier, match);

    const currentUser = Meteor.user();
    // ------------------------------ Checks ------------------------------ //

    // check that user can edit document
    if (!currentUser || !Users.is.admin(currentUser)) {
      throw new Meteor.Error(601, "You can't edit the settings.");
    }

    // go over each field and throw an error if it's not editable
    // loop over each operation ($set, $unset, etc.)
    _.each(modifier, function (fieldName,key) {
      // loop over each property being operated on
      var field = schema[key];
      if (!field.editableIf && !Users.is.admin(currentUser)) {
        // TODO: do something when fields are not editable
        throw new Meteor.Error("disallowed_property", __('disallowed_property_detected') + ": " + fieldName);
      }
    });

    return Telescope.settings.collection.update(modifier);

  },

});
