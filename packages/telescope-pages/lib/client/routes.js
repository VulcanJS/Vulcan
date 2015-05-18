Telescope.menuItems.add("adminMenu", {
  route: 'pages',
  label: 'Pages',
  description: 'manage_static_pages'
});

Telescope.subscriptions.preload('pages');

var PageController = RouteController.extend({
  currentPage: function () {
    return Pages.findOne({slug: this.params.slug});
  },
  getTitle: function () {
    return this.currentPage() && this.currentPage().title;
  },
  data: function () {
    return this.currentPage();
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
    controller: Telescope.controllers.admin
  });

});
