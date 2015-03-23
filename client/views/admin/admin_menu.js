Template[getTemplate('adminMenu')].helpers({
  adminMenuData: function () {
    return {
      dropdownName: 'admin',
      dropdownItems: adminMenu,
      dropdownMode: 'list'
    }
  }
});
