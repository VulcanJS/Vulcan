Telescope.adminRoutes.route('/feeds', {
  name: "adminFeeds",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "feeds"});
  }
});