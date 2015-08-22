var getRoute = function (item) {
  // if route is a Function return its result, else apply Router.path() to it
  return typeof item.route === "function" ? item.route() : Router.path(item.route);
};

var filterMenuItems = function (menuItems) {
  // filter out admin-only items if needed
  if (!Users.is.admin(Meteor.user())) {
    menuItems = _.reject(menuItems, function (item) {
      return item.adminOnly;
    });
  }
  return menuItems;  
};

Telescope.utils.getChildMenuItems = function (node) {

  var level = node.level;
  var childLevel = level + 1;
  var menuItems = node.allMenuItems;

  menuItems = filterMenuItems(menuItems);

  menuItems = _.filter(menuItems, function (item) {
    // return elements with the correct parentId
    return item.parentId === node._id;
  });

  // decorate child item with their level and a reference to the root level
  menuItems = _.map(menuItems, function (item) {
    item.level = childLevel;
    item.allMenuItems = node.allMenuItems
    return item;
  });

  return menuItems;
};

// Template.menuComponent.onCreated(function () {
//   menuItemsGlobal = this.data.menuItems;
// });

Template.menuComponent.helpers({
  rootMenuItems: function () {

    var allMenuItems = this.menuItems;
    var menuItems = filterMenuItems(allMenuItems); // filter out admin items if needed

    // get root elements
    menuItems = _.filter(menuItems, function(item) {
      return typeof item.parentId === "undefined";
    });
    
    menuItems = _.map(menuItems, function (item) {
      item.level = 0;
      item.allMenuItems = allMenuItems;
      return item;
    });
    
    return menuItems;

  },
  showMenuLabel: function () {
    return !this.hideMenuLabel;
  },
  menuClass: function () {
    var classes = [this.menuName+"-menu"];
    var count = filterMenuItems(this.menuItems).length;

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

Template.menuItem.onCreated(function () {
  // if menu item has a custom template specified, make that template inherit helpers from menuItem
  if (this.data.template) {
    Template[this.data.template].inheritsHelpersFrom("menuItem");
  }
});

Template.menuItem.helpers({
  hasTemplate: function () {
    return !!this.template;
  },
  menuItemData: function () {
    // if a data property is defined, use it for data context. Else default to current item
    return this.data ? this.data : this;
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
    return typeof this.label === "function" ? this.label() :  i18n.t(this.label);
  },
  itemRoute: function () {
    return getRoute(this);
  },
  childMenuItems: function () {    
    if (this._id) { // don't try to find child menu items if current element doesn't have an id
      var childMenuItems = Telescope.utils.getChildMenuItems(this);
      return childMenuItems;
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
