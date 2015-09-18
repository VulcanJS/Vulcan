Telescope.adminRoutes.route('/categories', {
  name: "adminCategories",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "categories_admin"});
  }
});
