SettingsController = RouteController.extend({

  onBeforeAction: function () {
    console.log('rendering admin menu')
    this.render(getTemplate('adminMenu'), {to: 'adminMenu'});
    this.next();
  }

});
  
Meteor.startup(function (){

  // Settings

  Router.route('/settings', {
    controller: SettingsController,
    name: 'settings',
    template: getTemplate('settingsForm'),
    // layoutTemplate: getTemplate('adminLayout'),
    data: function () {
      // we only have one set of settings for now
      return {
        hasSettings: !!Settings.find().count(),
        settings: Settings.findOne()
      }
    }
  });

 // Loading (for testing purposes)

  Router.route('/loading', {
    name: 'loading',
    template: getTemplate('loading')
  });

  // Toolbox

  Router.route('/toolbox', {
    name: 'toolbox',
    template: getTemplate('toolbox')
  });
  
});