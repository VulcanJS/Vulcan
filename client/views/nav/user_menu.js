Template[getTemplate('userMenu')].helpers({
  menuLabel: function () {
    return getDisplayName(Meteor.user());
  },
  menuItems: function () {
    return userMenu;
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
