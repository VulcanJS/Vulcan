Template[getTemplate('postViewsNav')].helpers({
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
  showItem: function () {
    var defaultViews = _.pluck(viewsMenu, 'route');
    // if item is not in postsViews setting, or item is adminOnly but current user is not admin
    if (!_.contains(getSetting('postViews', defaultViews), this.route) || (this.adminOnly && !isAdmin(Meteor.user()))) {
      // don't show the item
      return false
    }
    return true;
  }
});