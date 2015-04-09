adminMenu.push({
  route: 'pages',
  label: 'Pages',
  description: 'manage_static_pages'
});

preloadSubscriptions.push('pages');

PageController = RouteController.extend({
  getTitle: function () {
    return Pages.collection.findOne({slug: this.params.slug}).title;
  },
  data: function () {
    return Pages.collection.findOne({slug: this.params.slug});
  }
});

Meteor.startup(function () {

  Router.onBeforeAction(Router._filters.isAdmin, {only: ['pages']});

  Router.route('/page/:slug', {
    name: 'page',
    controller: PageController
  });

  Router.route('/pages', {
    name: 'pages',
    controller: AdminController
  });

});
