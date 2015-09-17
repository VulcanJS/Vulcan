var getRoute = function (item) {
  // if route is a Function return its result, else apply Router.path() to it
  if (typeof item.route === "function") {
    return item.route();
  } else {
    if (typeof Router !== "undefined") {
      return Router.path(item.route);
    } else if (typeof FlowRouter !== "undefined") {
      return FlowRouter.path(item.route);
    } else {
      throw new Error("Please use Flow Router or Iron Router");
    }
  }
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
  // don't try to find child menu items if current element doesn't have an id
  if (node.item._id) {

    var level = node.level;
    var childLevel = level + 1;
    var menuItems = filterMenuItems(node.allItems);

    menuItems = _.filter(menuItems, function (item) {
      // return elements with the correct parentId
      return item.parentId === node.item._id;
    });

    // build "node container" object
    menuItems = _.map(menuItems, function (item) {
      return {
        allItems: node.allItems,
        level: childLevel,
        item: item
      };
    });

    return menuItems;

  } else {
    return [];
  }
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
    
    // build "node container" object
    menuItems = _.map(menuItems, function (item) {
      return {
        allItems: allMenuItems,
        level: 0,
        item: item
      };
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
  var context = this.data;
  // if menu item has a custom template specified, make that template inherit helpers from menuItem
  if (context.item.template) {
    Template[context.item.template].inheritsHelpersFrom("menuItem");
  }
  // this should not be reactive, as we only want to set it once on template creation
  this.expand = this.data.item.isExpanded;
});

Template.menuItem.helpers({
  hasTemplate: function () {
    return !!this.item.template;
  },
  menuItemData: function () {
    // if a data property is defined, use it for data context. Else default to current node
    return this;
  },
  expandedClass: function () {
    return Template.instance().expand ? "menu-expanded" : "";
  },
  itemClass: function () {
    var itemClass = "";
    var currentPath = FlowRouter.current().path ;

    if (this.item.adminOnly) {
      itemClass += " item-admin";
    }
    if (this.item.route && (getRoute(this.item) === currentPath || getRoute(this.item) === Meteor.absoluteUrl() + currentPath.substr(1))) {
      // substr(1) is to avoid having two "/" in the URL
      itemClass += " item-active";
    }
    if (this.item.itemClass) {
      itemClass += " "+this.item.itemClass;
    }
    itemClass += " menu-level-" + this.level;
    
    return itemClass;
  },
  itemLabel: function () {
    // if label is a Function return its result, else return i18n'd version of label
    return typeof this.item.label === "function" ? this.item.label() :  i18n.t(this.item.label);
  },
  itemRoute: function () {
    return getRoute(this.item);
  },
  childMenuItems: function () {    
    return Telescope.utils.getChildMenuItems(this);
  }
});

Template.menuComponent.events({
  'click .menu-collapsible .js-menu-toggle': function (e) {
    e.preventDefault();
    var $menuItem = $(e.currentTarget).closest(".js-menu-container");

    if ($menuItem.hasClass("menu-expanded")) {
      $menuItem.find(".js-menu-items").first().slideUp('fast', function () {
        $menuItem.removeClass("menu-expanded");
      });
      
    } else {
      $menuItem.find(".js-menu-items").first().slideDown('fast', function () {
        $menuItem.addClass("menu-expanded");
      });
    }

  }
});
