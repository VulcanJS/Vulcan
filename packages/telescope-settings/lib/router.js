Meteor.startup(function () {
  // Settings

  Router.route('/settings', {
    controller: AdminController,
    name: 'settings',
    // layoutTemplate: getTemplate('adminLayout'),
    data: function () {
      // we only have one set of settings for now

      var settings = Settings.collection.findOne();
      return {
        hasSettings: !!settings,
        settings: settings
      };
    }
  });
});
