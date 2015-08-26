daysPerPage = 5;

Telescope.menuItems.add("viewsMenu", {
  route: 'postsDaily',
  label: 'daily',
  description: 'day_by_day_view'
});

Telescope.modules.addRoute("top", "views_menu", "postsDaily");