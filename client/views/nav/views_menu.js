Template[getTemplate('viewsMenu')].helpers({
  menuItem: function () {
    return getTemplate('menuItem');
  },
  views: function () {
    return viewNav;
  }
});
