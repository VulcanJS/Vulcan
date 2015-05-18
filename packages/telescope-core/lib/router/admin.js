Telescope.controllers.admin = RouteController.extend({

  template: "admin_wrapper"

});

Meteor.startup(function (){

 // Loading (for testing purposes)

  Router.route('/loading', {
    name: 'loading',
    template: 'loading'
  });

  // Toolbox

  Router.route('/toolbox', {
    name: 'toolbox',
    template: 'toolbox'
  });

});
