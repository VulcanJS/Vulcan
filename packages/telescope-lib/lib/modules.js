
Telescope.modules = {};

/**
 * Add a module to a template zone
 * @param {string} zone - The name of the zone
 * @param {Object|Object[]} module - The module object (or an array of modules)
 * @param {string} module.template - The template to include
 * @param {number} module.order - The order of the template in the zone
 */
Telescope.modules.register = function (zone, module) {

  // if module zone array doesn't exist yet, initialize it
  if (typeof Telescope.modules[zone] === "undefined") {
    Telescope.modules[zone] = [];
  }

  if (Array.isArray(module)) {

    var modules = module; // we're dealing with an Array, so let's add an "s"
    modules.forEach( function (module) {
      Telescope.modules[zone].push(module);
    });

  } else {

    Telescope.modules[zone].push(module);

  }
};

/**
 * Remove a module from a zone
 * @param {string} zone - The name of the zone
 * @param {string} template - The name of the template to remove
 */
Telescope.modules.remove = function (zone, template) {
  Telescope.modules[zone] = _.reject(Telescope.modules[zone], function (module) {
    return module.template === template;
  });
};

/**
 * Retrieve an array containing all modules for a zone
 * @param {string} zone - The name of the zone
 */
Telescope.modules.get = function (zone) {
  return _.sortBy(Telescope.modules[zone], "order");
};
