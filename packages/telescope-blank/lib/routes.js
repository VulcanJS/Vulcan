Meteor.startup(function () {
  
  Router.route('/custom-path', {
    name: 'customRoute',
    template: getTemplate('customTemplate')
  });

});