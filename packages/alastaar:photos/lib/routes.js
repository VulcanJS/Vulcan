Meteor.startup(function () {
  
  Router.route('/post', {
    name: 'postRoute',
    template: getTemplate('postTemplate')
  });

});