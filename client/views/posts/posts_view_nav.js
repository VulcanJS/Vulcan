Template[getTemplate('postsViewsNav')].helpers({
  viewsMenu: function () {
    return viewsMenu;
  },
  itemRoute: function () {
    return Router.path(this.route);
  },
  itemClass: function () {
    var itemClass = "";
    if (this.adminOnly) {
      itemClass += " admin-item";
    }
    return itemClass;
  },
});