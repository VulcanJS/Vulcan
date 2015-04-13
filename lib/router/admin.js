AdminController = RouteController.extend({

  template: "adminWrapper"

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
