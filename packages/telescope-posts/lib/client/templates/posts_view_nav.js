Template.posts_views_nav.helpers({
  showNav: function () {
    var navElements = Settings.get('postViews', _.pluck(Telescope.config.viewsMenu, 'route'));
    var navCount = _.isArray(navElements) ? navElements.length : _.keys(navElements).length;
    return navCount > 1;
  },
  menuItems: function () {
    var defaultViews = _.pluck(Telescope.menuItems.get("viewsMenu"), 'route');
    var menuItems = _.filter(Telescope.menuItems.get("viewsMenu"), function (item) {
      if (!_.contains(Settings.get('postViews', defaultViews), item.route) || (item.adminOnly && !Users.is.admin(Meteor.user()))) {
        // don't show the item
        return false;
      }
      return true;
    });
    return menuItems;
  }
});
