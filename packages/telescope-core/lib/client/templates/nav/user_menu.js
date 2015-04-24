Template.userMenu.helpers({
  menuLabel: function () {
    return Users.getDisplayName(Meteor.user());
  },
  menuItems: function () {
    return Telescope.menus.get("userMenu");
  },
  menuMode: function () {
    if (!!this.mobile) {
      return 'list';
    } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
      return 'dropdown';
    } else {
      return 'accordion';
    }
  }
});
