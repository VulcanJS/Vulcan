getCurrentPath = function () {
  if (typeof Router !== "undefined") {
    return Router.current().path;
  } else if (typeof FlowRouter !== "undefined") {
    FlowRouter.watchPathChange()
    return FlowRouter.current().path;
  } else {
    throw new Error("Please use Flow Router or Iron Router");
  }  
};

getRoute = function (item) {
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

toggleMenu = function ($menuItem) {
  if ($menuItem.hasClass("js-expanded")) {
    $menuItem.find(".js-menu-items").first().slideUp('fast', function () {
      $menuItem.removeClass("js-expanded").addClass("js-collapsed");
    });
  } else {
    $menuItem.find(".js-menu-items").first().slideDown('fast', function () {
      $menuItem.addClass("js-expanded").removeClass("js-collapsed");
    });
  }
};

getChildMenuItems = function (node) {
  // don't try to find child menu items if current element doesn't have an id
  if (node.item._id) {

    var level = node.level;
    var childLevel = level + 1;
    var menuItems = node.menu.menuItems;

    menuItems = _.filter(menuItems, function (item) {
      // return elements with the correct parentId
      return item.parentId === node.item._id;
    });

    // build "node container" object
    menuItems = _.map(menuItems, function (item) {
      return {
        menu: node.menu,
        level: childLevel,
        item: item
      };
    });
    return menuItems;

  } else {
    return [];
  }
};