/**
 * Menus namespace
 * @namespace Telescope.menuItems
 */
Telescope.menuItems = {};

/**
 * Add one or more items to a menu
 * @param {string} menu - The name of the menu
 * @param {Object|Object[]} item - The menu item object (or an array of items)
 *
 * @example <caption>Using a named route</caption>
 * Telescope.menuItems.add("viewsMenu", {
 *   route: 'postsDaily',
 *   label: 'daily',
 *   description: 'day_by_day_view'
 * });
 *
 * @example <caption>Using a route function</caption>
 * Telescope.menuItems.add("userMenu", {
 *   route: function () {
 *     return FlowRouter.path('user_profile', {_idOrSlug: Meteor.user().telescope.slug});
 *   },
 *   label: 'profile',
 *   description: 'view_your_profile'
 * });
 *
 */
Telescope.menuItems.add = function (menu, item) {

  // if menu items array doesn't exist yet, initialize it
  if (typeof Telescope.menuItems[menu] === "undefined") {
    Telescope.menuItems[menu] = [];
  }

  if (Array.isArray(item)) {

    var items = item; // we're dealing with an Array, so let's add an "s"
    items.forEach( function (item) {
      Telescope.menuItems[menu].push(Telescope.menuItems.internationalize(item));
    });

  } else {

    Telescope.menuItems[menu].push(Telescope.menuItems.internationalize(item));

  }
};

/**
 * Remove an item from a menu
 * @param {string} menu - The name of the menu
 * @param {string} label - The label of the item to remove
 */
Telescope.menuItems.remove = function (menu, label) {
  Telescope.menuItems[menu] = _.reject(Telescope.menuItems[menu], function (menu) {
    return menu.label === label;
  });
};

/**
 * Remove all items from a menu
 * @param {string} menu - The name of the menu
 */
Telescope.menuItems.removeAll = function (menu) {
  Telescope.menuItems[menu] = [];
};

/**
 * Retrieve an array containing all items for a menu
 * @param {string} menu - The name of the menu
 */
Telescope.menuItems.get = function (menu) {
  return _.sortBy(Telescope.menuItems[menu], "order");
};

/**
 * Replace label and description strings by a function that calls
 * i18n.t on said string
 * @param {Object} item - The menu item
 */
Telescope.menuItems.internationalize = function (item) {
  var i18nItem = _.clone(item);
  if (item.label && typeof item.label === "string") {
    i18nItem.label = function () {
      return i18n.t(item.label);
    };
  }
  if (item.description && typeof item.description === "string") {
    i18nItem.description = function () {
      return i18n.t(item.description);
    };
  }
  return i18nItem;
};