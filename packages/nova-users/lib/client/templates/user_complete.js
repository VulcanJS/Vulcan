AutoForm.hooks({
  completeUserForm: {
    onError: function(operation, error) {
      this.template.$('button[type=submit]').removeClass('loading');
      Messages.flash(error.message.split('|')[0], 'error'); // workaround because error.details returns undefined
      Messages.clearSeen();
    }
  }
});

Template.user_complete.helpers({
  user: function () {
    return Meteor.user();
  },
  requiredFields: function () {
    // return fields that are required by the schema but haven't been filled out yet
    var schema = Users.simpleSchema()._schema;
    var requiredFields = _.filter(_.keys(schema), function (fieldName) {
      var field = schema[fieldName];
      return !!field.required && !Telescope.getNestedProperty(Meteor.user(), fieldName);
    });
    return requiredFields;
  }
});

// TODO: handle error case when user validates form with blank fields