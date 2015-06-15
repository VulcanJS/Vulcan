Meteor.publish('settings', function() {
  var options = {};
  var privateFields = {};

  // look at Settings.simpleSchema._schema to see which fields should be kept private
  _.each(Settings.schema._schema, function (property, key) {
    if (property.autoform && property.autoform.private) {
      privateFields[key] = false;
    }
  });

  if(!Users.is.adminById(this.userId)){
    options = _.extend(options, {
      fields: privateFields
    });
  }

  return Settings.find({}, options);
});
