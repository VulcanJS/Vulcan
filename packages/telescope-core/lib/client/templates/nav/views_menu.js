Template.viewsMenu.helpers({
  viewsMenuData: function () {
    return {
      dropdownName: 'view',
      dropdownItems: Telescope.menus.get("viewsMenu")
    };
  }
});
