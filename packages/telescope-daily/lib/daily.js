daysPerPage = 5;

Telescope.menuItems.add("viewsMenu", {
  route: Posts.getRoute,
  name: 'daily',
  label: function () { return i18n.t('daily'); },
  description: function () { return i18n.t('day_by_day_view'); },
  viewTemplate: 'posts_daily'
});