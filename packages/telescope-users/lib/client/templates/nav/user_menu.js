Template.user_menu.helpers({
  user: function () {
    return Meteor.user();
  },
  menuItems: function () {
    return Telescope.menuItems.get("userMenu");
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
