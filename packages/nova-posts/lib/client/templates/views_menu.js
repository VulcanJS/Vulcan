var getMenuItems = function () {
  var defaultItems = Telescope.menuItems.get("viewsMenu");

  // reject an item if the item is admin only and the current user is not an admin
  // or if views have been configured in the settings and the item is not part of them
  var viewableItems = _.reject(defaultItems, function (item) {
    return (item.adminOnly && !Users.is.admin(Meteor.user())) || (!!Telescope.settings.get('postViews') && !_.contains(Telescope.settings.get('postViews'), item.name));
  });

  viewableItems = _.map(viewableItems, function (item) {
    item.itemClass = "view-"+item.name;
    return item;
  });

  return viewableItems; 
};

Template.views_menu.helpers({
  menuLabel: function () {
    return __("view");
  },
  menuItems: function () {
    return getMenuItems();
  }
});
