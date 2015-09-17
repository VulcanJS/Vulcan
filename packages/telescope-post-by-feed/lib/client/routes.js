Telescope.menuItems.add("adminMenu", {
  route: 'adminFeeds',
  label: 'Feeds',
  description: 'import_new_posts_from_feeds'
});

Telescope.adminRoutes.route('/feeds', {
  name: "adminFeeds",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "feeds"});
  }
});