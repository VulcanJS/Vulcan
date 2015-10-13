
// ------------------------------- menuComponent ------------------------------- //

Template.menuComponent.onCreated(function () {

  var menu = this.data;
  
  // if menu has a custom item template specified, make that template inherit helpers and events from defaultMenuItem
  if (menu.itemTemplate) {
    Template[menu.itemTemplate].inheritsHelpersFrom("defaultMenuItem");
    Template[menu.itemTemplate].inheritsEventsFrom("defaultMenuItem");
  }

});

Template.menuComponent.helpers({

  // generate menu's CSS class
  menuClass: function () {
    var classes = [this.menuName+"-menu"];
    var count = this.menuItems.length;

    if (!!this.menuClass) {
      classes.push(this.menuClass);
    } else {
      classes.push("menu-list");
    }

    if (count) {
      classes.push("menu-has-items");
    } else {
      classes.push("menu-no-items");
    }

    if (!!this.startPosition) {
      if (this.startPosition === "expanded") {
        classes.push("js-expanded");
      } else {
        classes.push("js-collapsed");
      }
    } else {
      classes.push("js-collapsed");
    }

    return _.unique(classes).join(" ");
  },

  // whether to show the menu label or not
  showMenuLabel: function () {
    return !!this.menuLabelTemplate || !!this.menuLabel;
  },

  // get the original set of root menu items
  rootMenuItems: function () {

    var menu = this;
    var menuItems = menu.menuItems;

    // get root elements
    menuItems = _.filter(menuItems, function(item) {
      return typeof item.parentId === "undefined";
    });
    
    // build "node container" object
    menuItems = _.map(menuItems, function (item) {
      return {
        menu: menu,
        level: 0,
        item: item
      };
    });
    
    return menuItems;

  }

});

Template.menuComponent.events({

  'click .js-menu-toggle': function (e) {
    e.preventDefault();
    var $menuItem = $(e.currentTarget).closest(".js-menu-container");
    toggleMenu($menuItem);
  }

});

// ------------------------------- defaultMenuLabel ------------------------------- //

Template.defaultMenuLabel.helpers({
  getMenuLabel: function () {
    return typeof this.menuLabel === "function" ? this.menuLabel() :  this.menuLabel;
  }
});

// ------------------------------- menuItem ------------------------------- //

Template.menuItem.onCreated(function () {

  // if menu item has a custom template specified, make that template inherit helpers from defaultMenuItem
  if (this.data.item.template) {
    Template[this.data.item.template].inheritsHelpersFrom("defaultMenuItem");
    Template[this.data.item.template].inheritsEventsFrom("defaultMenuItem");
  }

  // this should not be reactive, as we only want to set it once on template creation
  this.expanded = this.data.item.isExpanded;

});

Template.menuItem.helpers({

  // custom templates can be specified at the menu or menu item level
  getTemplate: function () {
    return this.item.template || this.menu.itemTemplate;
  },
  
  // generate item's CSS class
  itemClass: function () {
    var classes = [];
    var currentPath = getCurrentPath();
    var isActive = this.item.route && (getRoute(this.item) === currentPath || getRoute(this.item) === Meteor.absoluteUrl() + currentPath.substr(1));

    if (isActive) {
      // substr(1) is to avoid having two "/" in the URL
      classes.push("item-active");
    }

    if (getChildMenuItems(this).length) {
      classes.push("menu-item-has-children");
    } else {
      classes.push("menu-item-no-children");
    }

    if (Template.instance().expanded) {
      classes.push("js-expanded");
    } else {
      classes.push("js-collapsed");
    }

    if (this.item.itemClass) {
      classes.push(this.item.itemClass);
    }

    classes.push("menu-level-" + this.level);
    
    return _.unique(classes).join(" ");;
  },

  // generate array of child menu items
  childMenuItems: function () {    
    return getChildMenuItems(this);
  }

});

// ------------------------------- defaultMenuItem ------------------------------- //

Template.defaultMenuItem.helpers({

  // the item's label
  getItemLabel: function () {
    return typeof this.item.label === "function" ? this.item.label() :  this.item.label;
  },

  // the item's description
  getItemDescription: function () {
    return typeof this.item.description === "function" ? this.item.description() :  this.item.description;
  },

  // the item's route
  itemRoute: function () {
    return getRoute(this.item);
  },

  // generate array of child menu items
  childMenuItems: function () {    
    return getChildMenuItems(this);
  }
});

Template.defaultMenuItem.events({

  'click .js-menu-toggle': function (e) {
    e.preventDefault();
    var $menuItem = $(e.currentTarget).closest(".js-menu-container");
    toggleMenu($menuItem);
  }

});