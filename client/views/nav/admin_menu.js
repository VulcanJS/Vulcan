Template[getTemplate('adminMenu')].helpers({
  menuItem: function () {
    return getTemplate('menuItem');
  },
  menu: function () {
    return adminNav;
  }
});