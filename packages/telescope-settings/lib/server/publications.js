Meteor.publish('settings', function() {
  var options = {};
  var privateFields = {};

  // look at Settings.schema to see which fields should be kept private
  _.each(Settings.schema._schema, function( val, key ) {
    if (val.autoform && !!val.autoform.private)
      privateFields[key] = false;
  });

  if(!isAdminById(this.userId)){
    options = _.extend(options, {
      fields: privateFields
    });
  }

  return Settings.collection.find({}, options);
});
