daysPerPage = 5;

Telescope.menuItems.add("viewsMenu", {
  route: Posts.getRoute,
  name: 'daily',
  label: 'daily',
  description: 'day_by_day_view',
  viewTemplate: 'posts_daily'
});