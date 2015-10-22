
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