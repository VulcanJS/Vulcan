/**
 * Telescope theme settings and methods.
 * @namespace Telescope.theme
 */
Telescope.theme = {};

/**
 * Default settings for Telescope themes.
 * @type {Object}
 */
Telescope.theme.settings = {
  useDropdowns: true // Enable/disable dropdown menus in a theme
};

/**
 * Get a theme setting value.
 * @param {String} setting
 * @param {String} defaultValue
 */
Telescope.theme.getSetting = function (setting, defaultValue) {
  if (typeof this.settings[setting] !== 'undefined') {
    return this.settings[setting];
  } else {
    return typeof defaultValue === 'undefined' ? '' : defaultValue;
  }
};
