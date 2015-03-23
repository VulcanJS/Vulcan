Template[getTemplate('adminWrapper')].helpers({
  adminMenu: function () {
    return getTemplate("adminMenu");
  },
  contents: function () {
    console.log(Router.current().route.getName())
    return Router.current().route.getName();
  },
  contentsClass: function () {
    return Router.current().route.getName()+"-contents";
  }
});
