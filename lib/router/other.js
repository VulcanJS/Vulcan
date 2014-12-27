Meteor.startup(function (){

  // Settings

  Router.route('/settings', {
    name: 'settings',
    template: getTemplate('settingsForm'),
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