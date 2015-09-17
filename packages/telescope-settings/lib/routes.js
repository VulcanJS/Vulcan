Telescope.adminRoutes.route('/settings', {
  name: "adminSettings",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "settings"});
  }
});
