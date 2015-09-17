Telescope.menuItems.add("adminMenu", {
  route: 'adminPages',
  label: 'Pages',
  description: 'manage_static_pages'
});

Telescope.adminRoutes.route('/pages', {
  name: "adminPages",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "pages"});
  }
});

FlowRouter.route('/page/:slug', {
  name: "page",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "page"});
  }
});

// var PageController = RouteController.extend({
//   currentPage: function () {
//     return Pages.findOne({slug: this.params.slug});
//   },
//   getTitle: function () {
//     return this.currentPage() && this.currentPage().title;
//   },
//   data: function () {
//     return this.currentPage();
//   }
// });

// Meteor.startup(function () {

//   Router.onBeforeAction(Router._filters.isAdmin, {only: ['pages']});

//   Router.route('/page/:slug', {
//     name: 'page',
//     controller: PageController
//   });

//   Router.route('/pages', {
//     name: 'pages',
//     controller: Telescope.controllers.admin
//   });

// });
