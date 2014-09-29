Meteor.startup(function () {
  Router.map(function() {
    this.route('about', {
      path: '/about',
      template: getTemplate('aboutPage')
    });
  });
});

primaryNav.push('aboutLink');
