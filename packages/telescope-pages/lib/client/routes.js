Telescope.menuItems.add("adminMenu", {
  route: 'adminPages',
  label: _.partial(i18n.t, "pages"),
  description: _.partial(i18n.t, "manage_static_pages"),
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