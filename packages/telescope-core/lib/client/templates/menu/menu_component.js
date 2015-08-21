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

Template.menuComponent.helpers({
  rootMenuItems: function () {
    return filterMenuItems(this.menuItems, 0);
  },
  showMenuLabel: function () {
    return !this.hideMenuLabel;
  },
  menuClass: function () {
    var classes = [this.menuName+"-menu"];
    var mode = (typeof this.menuMode === "undefined") ? "list" : this.menuMode;
    var count = filterMenuItems(this.menuItems, 0).length;

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

    // note: for some reason, we need to go back one level to go from child to root, but 
    // two levels to go from grandchild to child
    var levelIncrement = this.level === 1 ? 1 : 2;

    var allMenuItems = Template.parentData(currentLevel+levelIncrement).menuItems;

    if (this._id) { // don't try to find child menu items if current element doesn't have an id
      return filterMenuItems(allMenuItems, currentLevel, this._id);
    }
  }
});