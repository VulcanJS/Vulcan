getRoute = function (item) {
  // if route is a Function return its result, else apply Router.path() to it
  return typeof item.route == "function" ? item.route() : Router.path(item.route);
}

// filter out admin-only items if needed
getMenuItems = function (menu) {
  var menuItems = menu.menuItems;

  if (!isAdmin(Meteor.user())) {
    menuItems = _.reject(menuItems, function (item) {
      return item.adminOnly;
    });
  }

  return menuItems;
}

Template[getTemplate('menuComponent')].helpers({
  getMenuItems: function () {
    return getMenuItems(this);
  },
  menuClass: function () {

    var classes = [this.menuName+"-menu"];
    var mode = (typeof this.menuMode === "undefined") ? "list" : this.menuMode;
    var count = getMenuItems(this).length;

    classes.push("menu-"+mode);

    if (!!this.menuClass) {
      classes.push(this.menuClass)
    }

    if (this.menuCollapsed) {
      classes.push("menu-collapsed");
      classes.push("menu-show-more");
    }

    if (count) {
      classes.push("menu-has-items");
      if (count > 3) {
        classes.push("menu-show-more");
      }
    } else {
      classes.push("menu-no-items");
    }

    return _.unique(classes).join(" ");
  },
  menuLabel: function () {
    // if label is defined, use this. Else default to menu name
    return !!this.menuLabel ? this.menuLabel : i18n.t(this.menuName);
  },
  hasTemplate: function () {
    return !!this.template;
  },
  itemClass: function () {
    var itemClass = "";
    var currentPath = Router.current().location.get().path ;
    
    if (this.adminOnly) {
      itemClass += " item-admin";
    }
    if (getRoute(this) === currentPath || getRoute(this) === Meteor.absoluteUrl() + currentPath.substr(1)) {
      // substr(1) is to avoid having two "/" in the URL
      itemClass += " item-active";
    }
    if (this.itemClass) {
      itemClass += " "+this.itemClass;
    }

    return itemClass;
  },
  itemLabel: function () {
    // if label is a Function return its result, else return i18n'd version of label
    return typeof this.label == "function" ? this.label() :  i18n.t(this.label);
  },
  itemRoute: function () {
    return getRoute(this);
  }
});

Template[getTemplate('menuComponent')].events({
  'click .show-more': function (e, t) {
    e.preventDefault();
    $menu = t.$('.menu');
    $menu.toggleClass('menu-open');
  }
});