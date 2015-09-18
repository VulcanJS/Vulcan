var getMenuItems = function () {
  var defaultItems = Telescope.menuItems.get("viewsMenu");

  // reject an item if the item is admin only and the current user is not an admin
  // or if views have been configured in the settings and the item is not part of them
  var viewableItems = _.reject(defaultItems, function (item) {
    return (item.adminOnly && !Users.is.admin(Meteor.user())) || (!!Settings.get('postViews') && !_.contains(Settings.get('postViews'), item.label));
  });

  return viewableItems; 
};

Template.views_menu.helpers({
  menuItems: function () {
    return getMenuItems();
  }
});
