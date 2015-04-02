getRoute = function (item) {
  // if route is a Function return its result, else apply Router.path() to it
  return typeof item.route == "function" ? item.route() : Router.path(item.route);
}

Template[getTemplate('menuComponent')].helpers({
  menuClass: function () {

    var classes = [this.menuName+"-menu"];
    var mode = (typeof this.menuMode === "undefined") ? "list" : this.menuMode;
    var count = this.menuItems.length;

    classes.push("menu-"+mode);

    if(!!this.menuClass) {
      classes.push(this.menuClass)
    }

    // enable menu if top-nav layout is enabled, if themes supports menus, and if menu isn't empty
    if (count) {
      classes.push("menu-has-items");
      if (count > 3) {
        classes.push("menu-long");
      }
    } else {
      classes.push("menu-no-items");
    }

    return classes.join(" ");
  },
  menuLabel: function () {
    // if label is defined, use this. Else default to menu name
    return !!this.menuLabel ? this.menuLabel : i18n.t(this.menuName);
  },
  showMenuItem: function () {
    // if this is an admin item, only show it if current user is admin
    return this.adminOnly ? isAdmin(Meteor.user()) : true;
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