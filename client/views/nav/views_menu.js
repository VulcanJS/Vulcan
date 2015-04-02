Template[getTemplate('viewsMenu')].helpers({
  viewsMenuData: function () {
    return {
      dropdownName: 'view',
      dropdownItems: viewsMenu
    }
  }
});
