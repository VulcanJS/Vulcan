Template[getTemplate('adminWrapper')].helpers({
  adminMenu: function () {
    return getTemplate("adminMenu");
  },
  contents: function () {
    return Router.current().route.getName();
  },
  contentsClass: function () {
    return Router.current().route.getName()+"-contents";
  }
});
