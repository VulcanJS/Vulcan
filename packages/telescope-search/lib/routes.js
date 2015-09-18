Telescope.menuItems.add("adminMenu", [
  {
    route: 'adminSearchLogs',
    label: 'searchLogs',
    description: 'telescope_settings_panel'
  }
]);

Telescope.adminRoutes.route('/search-logs', {
  name: "adminSearchLogs",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {main: "admin_wrapper", admin: "search_logs"});
  }
});