Template[getTemplate('userMenu')].helpers({
  userMenuData: function () {
    return {
      dropdownName: 'userMenu',
      dropdownLabel: getDisplayName(Meteor.user()),
      dropdownItems: userMenu
    }
  }
});
