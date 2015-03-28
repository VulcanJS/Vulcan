Template[getTemplate('postViewsNav')].helpers({
  showNav: function () {
    var navElements = Settings.get('postViews', _.pluck(viewsMenu, 'route'));
    var navCount = (typeof navElements === "array") ? navElements.length : _.keys(navElements).length;
    return navCount > 1;
  },
  menuItems: function () {
    var defaultViews = _.pluck(viewsMenu, 'route');
    var menuItems = _.filter(viewsMenu, function (item) {
      if (!_.contains(Settings.get('postViews', defaultViews), item.route) || (item.adminOnly && !isAdmin(Meteor.user()))) {
        // don't show the item
        return false;
      }
      return true;
    });
    return menuItems;
  }
});
