daysPerPage = 5;

Telescope.menuItems.add("viewsMenu", {
  route: 'postsDaily',
  label: 'daily',
  description: 'day_by_day_view'
});

_.findWhere(Telescope.modules.top,{template: "posts_views_nav"}).only.push("postsDaily");