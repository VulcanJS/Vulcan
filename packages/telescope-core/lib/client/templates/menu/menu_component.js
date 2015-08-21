menuItemsGlobal= [];

getRoute = function (item) {
  // if route is a Function return its result, else apply Router.path() to it
  return typeof item.route === "function" ? item.route() : Router.path(item.route);
};


filterMenuItems = function (menuItems, level, parentId) {
  var childLevel = level + 1; 

  // filter out admin-only items if needed
  if (!Users.is.admin(Meteor.user())) {
    menuItems = _.reject(menuItems, function (item) {
      return item.adminOnly;
    });
  }

  menuItems = _.filter(menuItems, function (item) {
    if (level === 0) {
      // if this is the root level, return elements with no parentId
      return typeof item.parentId === "undefined";
    } else {
      // else, return elements with the correct parentId
      return item.parentId === parentId;
    }
  });

  // decorate child item with their level
  menuItems = _.map(menuItems, function (item) {
    item.level = childLevel;
    return item;
  });

  return menuItems;
};

Template.menuComponent.onCreated(function () {
  menuItemsGlobal = this.data.menuItems;
});

Template.menuComponent.helpers({
  rootMenuItems: function () {
    return filterMenuItems(this.menuItems, 0);
  },
  showMenuLabel: function () {
    return !this.hideMenuLabel;
  },
  menuClass: function () {
    var classes = [this.menuName+"-menu"];
    var count = filterMenuItems(this.menuItems, 0).length;

    if (!!this.menuClass) {
      classes.push(this.menuClass)
    }

    if (count) {
      classes.push("menu-has-items");
    } else {
      classes.push("menu-no-items");
    }

    return _.unique(classes).join(" ");
  },
  menuLabel: function () {
    // if label is defined, use this. Else default to menu name
    return !!this.menuLabel ? this.menuLabel : i18n.t(this.menuName);
  },
  labelIsTemplate: function () {
    return !!this.menuLabelTemplate;
  }
});

Template.menuComponent.events({
  'click .show-more': function (e, t) {
    e.preventDefault();
    $menu = t.$('.menu');
    $menu.toggleClass('menu-open');
  }
});

Template.menuItem.helpers({
  hasTemplate: function () {
    return !!this.template;
  },
  itemClass: function () {
    var itemClass = "";
    var currentPath = Router.current().location.get().path ;

    if (this.adminOnly) {
      itemClass += " item-admin";
    }
    if (this.route && (getRoute(this) === currentPath || getRoute(this) === Meteor.absoluteUrl() + currentPath.substr(1))) {
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
  },
  childMenuItems: function () {
    var currentLevel = this.level;
    if (this._id) { // don't try to find child menu items if current element doesn't have an id
      return filterMenuItems(menuItemsGlobal, currentLevel, this._id);
    }
  }
});

Template.menuComponent.events({
  'click .menu-collapsible .menu-top-level-link': function (e) {
    e.preventDefault();
    var $menu = $(e.currentTarget).closest(".menu-collapsible");
    $menu.toggleClass("menu-expanded");
    $menu.find(".menu-items-toggle").first().toggleClass("toggle-expanded");
    $menu.find(".menu-wrapper").first().slideToggle('fast');
  },
  'click .menu-collapsible .menu-items-toggle': function (e) {
    e.preventDefault();
    var $menuItem = $(e.currentTarget).closest(".menu-item");
    $menuItem.toggleClass("menu-expanded");

    // menu item could contain multiple nested sub-menus, so always use first()
    $menuItem.find(".menu-items-toggle").first().toggleClass("toggle-expanded");
    $menuItem.find(".menu-child-items").first().slideToggle('fast');
  
  }
});
