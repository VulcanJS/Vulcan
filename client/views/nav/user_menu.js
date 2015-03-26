Template[getTemplate('userMenu')].helpers({
  userMenuData: function () {

    if (!!this.mobile) {
      var dropdownMode = 'list';
    } else if (getSetting('navLayout', 'top-nav') === 'top-nav') {
      var dropdownMode = 'hover';
    } else {
      var dropdownMode = 'accordion';
    }

    return {
      dropdownName: 'user',
      dropdownLabel: getDisplayName(Meteor.user()),
      dropdownItems: userMenu,
      dropdownClass: 'header-submodule',
      dropdownMode: dropdownMode
    }
  }
});
