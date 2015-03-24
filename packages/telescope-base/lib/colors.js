colorTable = {
  headerColor: [],
  headerTextColor: [],
  buttonColor: [],
  buttonTextColor: []
}

registerElementColor = function (selector, color, property) {
  var element = {selector: selector};

  if (typeof property !== "undefined")
    element.property = property

  colorTable[color].push(element);
}

// shortcuts

headerColor = function (selector, property) {registerElementColor(selector, "headerColor", property);}
headerTextColor = function (selector, property) {registerElementColor(selector, "headerTextColor", property);}
buttonColor = function (selector, property) {registerElementColor(selector, "buttonColor", property);}
buttonTextColor = function (selector, property) {registerElementColor(selector, "buttonTextColor", property);}

// headerColor

headerColor(".header", "background-color");

// headerTextColor

headerTextColor(".header");
headerTextColor(".header .logo a");
headerTextColor(".header .logo a:visited");

headerTextColor(".header .dropdown-top-level", "border-color");
headerTextColor(".header .dropdown-accordion .show-more", "border-color");

// buttonColor

buttonColor("a:hover");
buttonColor(".post-content .post-heading .post-title:hover");
buttonColor(".post-content .post-upvote .icon");
buttonColor(".comment-actions a i");
buttonColor(".comment-actions.upvoted .upvote i");
buttonColor(".comment-actions.downvoted .downvote i");
buttonColor(".toggle-actions-link");
buttonColor(".post-meta a:hover");
buttonColor(".action:hover");
buttonColor(".post-upvote .upvote-link i");
buttonColor(".post-actions .icon");
buttonColor(".post-share .icon-share");

buttonColor('input[type="submit"]', 'background-color');
buttonColor("button", 'background-color');
buttonColor(".button", 'background-color');
buttonColor("button.submit", 'background-color');
buttonColor(".auth-buttons #login-buttons #login-buttons-password", 'background-color');
buttonColor(".btn-primary", 'background-color');
buttonColor(".header .btn-primary", 'background-color');
buttonColor(".header .btn-primary:link", 'background-color');
buttonColor(".header .btn-primary:visited", 'background-color');
buttonColor(".error", 'background-color');
buttonColor(".mobile-menu-button", 'background-color');
buttonColor(".login-link-text", 'background-color');
buttonColor(".post-category:hover", 'background-color');

buttonColor(".icon-upvote", "border-color");
buttonColor(".icon-more", "border-color");

// buttonTextColor

buttonTextColor('input[type="submit"]');
buttonTextColor("button");
buttonTextColor(".button");
buttonTextColor("button.submit");
buttonTextColor(".auth-buttons #login-buttons #login-buttons-password");
buttonTextColor(".btn-primary");
buttonTextColor(".header .btn-primary");
buttonTextColor(".header .btn-primary:link");
buttonTextColor(".header .btn-primary:visited");
buttonTextColor(".error");
buttonTextColor(".mobile-menu-button");
buttonTextColor("login-link-text");
buttonTextColor(".post-category:hover");

