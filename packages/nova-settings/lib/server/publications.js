import Users from 'meteor/nova:users';

// Meteor.publish('settings', function() {
//   var options = {};
//   var privateFields = {};

//   // look at Settings.simpleSchema._schema to see which fields should be kept private
//   _.each(Telescope.settings.collection.simpleSchema()._schema, (property, key) => {
//     if (property.private) 
//       privateFields[key] = false;
//   });

//   options = _.extend(options, {
//     fields: privateFields
//   });

//   return Telescope.settings.collection.find({}, options);
// });

Telescope.settings.collection.smartPublish('settings');

Meteor.publish('settings.admin', function() {
  if (Users.is.adminById(this.userId)) {
    return Telescope.settings.collection.find({}, {});
  } else {
    return [];
  }
});
