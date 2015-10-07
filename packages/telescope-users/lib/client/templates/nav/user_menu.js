Template.user_menu.helpers({
  user: function () {
    return Meteor.user();
  },
  menuItems: function () {
    var viewableItems = _.reject(Telescope.menuItems.get("userMenu"), function (item) {
      return (item.adminOnly && !Users.is.admin(Meteor.user()));
    });
    return viewableItems;
  },
  menuClass: function () {
    if (!!this.mobile) {
      return 'menu-collapsible';
    } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
      return 'menu-dropdown';
    } else {
      return 'menu-collapsible';
    }
  }
});
