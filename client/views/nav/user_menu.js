Template[getTemplate('userMenu')].helpers({
  userMenuData: function () {
    return {
      dropdownName: 'user',
      dropdownLabel: getDisplayName(Meteor.user()),
      dropdownItems: userMenu,
      dropdownClass: 'header-submodule',
      dropdownMode: getSetting('navLayout', 'top-nav') == 'top-nav' ? 'hover' : 'accordion'
    }
  }
});
