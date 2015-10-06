/**
 * A dictionnary of all the elements that use custom colors
 */

Telescope.colorElements = {};

Telescope.colorElements.colorTable = {
  accentColor: [],
  accentContrastColor: [],
  secondaryColor: [],
  secondaryContrastColor: []
};

Telescope.colorElements.defaultColors = {
  accentColor: "#DD3416", // red
  accentContrastColor: "#ffffff", // white
  secondaryColor: "#4e555d", // slate
  secondaryContrastColor: "#ffffff" // white
};

/**
 * Register an element to use a custom color
 * @param {string} selector - the CSS selector of the element
 * @param {string} color - the color. Either `accentColor`, `accentContrastColor`, `secondaryColor`, or `secondaryContrastColor`
 * @param {string} [property=color] - the property to colorize. Usually `color`, `background-color`, `border-color`, etc. 
 */
Telescope.colorElements.add = function (selector, color, property) {
  var element = {selector: selector};

  if (typeof property !== "undefined")
    element.property = property;

  Telescope.colorElements.colorTable[color].push(element);
};

// shortcuts
var setShortcut = function(name) {
  return function (selector, property) {
    Telescope.colorElements.add(selector, name, property);
  };
};

var accent = setShortcut('accentColor');
var accentContrast = setShortcut('accentContrastColor');
var secondary = setShortcut('secondaryColor');
var secondaryContrast = setShortcut('secondaryContrastColor');

// accentColor

accent("a:hover");
accent(".post-content .post-heading .post-title:hover");
accent(".upvoted .upvote-link");
accent(".downvoted .downvote-link");
accent(".upvoted .upvote");
accent(".downvoted .downvote");
accent(".toggle-actions-link");
accent(".post-meta a:hover");
accent(".action:hover");
accent(".post-actions .icon");

accent('input[type="submit"]', 'background-color');
accent("button", 'background-color');
accent(".button", 'background-color');
accent(".auth-buttons #login-buttons #login-buttons-password", 'background-color');
accent(".btn-primary", 'background-color');
accent(".header .btn-primary", 'background-color');
accent(".header .btn-primary:link", 'background-color');
accent(".header .btn-primary:visited", 'background-color');
accent(".error", 'background-color');
accent(".mobile-menu-button", 'background-color');
accent(".login-link-text", 'background-color');
accent(".post-category:hover", 'background-color');

accent(".icon-more", "border-color");
accent(".post-admin a:hover", "background-color");

// accentContrastColor

accentContrast('input[type="submit"]');
accentContrast("button");
accentContrast(".button");
accentContrast(".menu-dropdown .menu-wrapper a.button");
accentContrast(".auth-buttons #login-buttons #login-buttons-password");
accentContrast(".btn-primary");
accentContrast(".btn-primary:link");
accentContrast(".btn-primary:hover");
accentContrast(".header .btn-primary:link");
accentContrast(".header .btn-primary:visited");
accentContrast(".error");
accentContrast(".header a.mobile-menu-button");
accentContrast("login-link-text");
accentContrast(".post-category:hover");
accentContrast(".post-admin a:hover", "color");

// secondaryColor

secondary(".header", "background-color");

// secondaryContrastColor

secondaryContrast(".header");
secondaryContrast(".header .logo a");
secondaryContrast(".header .logo a:visited");

secondaryContrast(".header .dropdown-top-level", "border-color");
secondaryContrast(".header .dropdown-accordion .show-more", "border-color");
