/**
 * Menus namespace
 * @namespace Telescope.menus
 */
Telescope.menus = {};

/**
 * Add one or more items to a menu
 * @param {string} menu - The name of the menu
 * @param {Object|Object[]} item - The menu item object (or an array of items)
 *
 * @example <caption>Using a named route</caption>
 * Telescope.menus.register("viewsMenu", {
 *   route: 'postsDaily',
 *   label: 'daily',
 *   description: 'day_by_day_view'
 * });
 *
 * @example <caption>Using a route function</caption>
 * Telescope.menus.register("userMenu", {
 *   route: function () {
 *     return Router.path('user_profile', {_idOrSlug: Meteor.user().telescope.slug});
 *   },
 *   label: 'profile',
 *   description: 'view_your_profile'
 * });
 *
 */
Telescope.menus.register = function (menu, item) {

  // if menu items array doesn't exist yet, initialize it
  if (typeof Telescope.menus[menu] === "undefined") {
    Telescope.menus[menu] = [];
  }

  if (Array.isArray(item)) {

    var items = item; // we're dealing with an Array, so let's add an "s"
    items.forEach( function (item) {
      Telescope.menus[menu].push(item);
    });

  } else {

    Telescope.menus[menu].push(item);

  }
};

/**
 * Remove an item from a menu
 * @param {string} menu - The name of the menu
 * @param {string} label - The label of the item to remove
 */
Telescope.menus.remove = function (menu, label) {
  Telescope.menus[menu] = _.reject(Telescope.menus[menu], function (menu) {
    return menu.label === label;
  });
};

/**
 * Retrieve an array containing all items for a menu
 * @param {string} menu - The name of the menu
 */
Telescope.menus.get = function (menu) {
  return _.sortBy(Telescope.menus[menu], "order");
};
