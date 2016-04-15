Meteor.startup(function () {
  if (Telescope.settings.collection.find().count() === 0) {
    Telescope.settings.collection.insert({});
  }
});