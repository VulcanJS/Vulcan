AdminController = RouteController.extend({

  template: "adminWrapper"

});

Meteor.startup(function (){

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
