Template.admin_wrapper.helpers({
  contents: function () {
    return Router.current().route.getName();
  },
  contentsClass: function () {
    return Router.current().route.getName()+"-contents";
  }
});
