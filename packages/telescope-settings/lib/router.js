Meteor.startup(function () {
  // Settings

  Router.route('/settings', {
    controller: Telescope.controllers.admin,
    name: 'settings',
    template: 'settings_form',
    // layoutTemplate: 'adminLayout',
    data: function () {
      // we only have one set of settings for now

      var settings = Settings.findOne();
      return {
        hasSettings: !!settings,
        settings: settings
      };
    }
  });
});
