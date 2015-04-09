colorTable = {
  accentColor: [],
  accentContrastColor: [],
  secondaryColor: [],
  secondaryContrastColor: []
}

registerElementColor = function (selector, color, property) {
  var element = {selector: selector};

  if (typeof property !== "undefined")
    element.property = property

  colorTable[color].push(element);
}

// shortcuts

accent = function (selector, property) {registerElementColor(selector, "accentColor", property);}
accentContrast = function (selector, property) {registerElementColor(selector, "accentContrastColor", property);}
secondary = function (selector, property) {registerElementColor(selector, "secondaryColor", property);}
secondaryContrast = function (selector, property) {registerElementColor(selector, "secondaryContrastColor", property);}

// accentColor

accent("a:hover");
accent(".post-content .post-heading .post-title:hover");
accent(".post-content .post-upvote .icon");
accent(".comment-actions a i");
accent(".comment-actions.upvoted .upvote i");
accent(".comment-actions.downvoted .downvote i");
accent(".toggle-actions-link");
accent(".post-meta a:hover");
accent(".action:hover");
accent(".post-upvote .upvote-link i");
accent(".post-actions .icon");
accent(".post-share .icon-share");

accent('input[type="submit"]', 'background-color');
accent("button", 'background-color');
accent(".button", 'background-color');
accent("button.submit", 'background-color');
accent(".auth-buttons #login-buttons #login-buttons-password", 'background-color');
accent(".btn-primary", 'background-color');
accent(".header .btn-primary", 'background-color');
accent(".header .btn-primary:link", 'background-color');
accent(".header .btn-primary:visited", 'background-color');
accent(".error", 'background-color');
accent(".mobile-menu-button", 'background-color');
accent(".login-link-text", 'background-color');
accent(".post-category:hover", 'background-color');

accent(".icon-upvote", "border-color");
accent(".icon-more", "border-color");

// accentContrastColor

accentContrast('input[type="submit"]');
accentContrast("button");
accentContrast(".button");
accentContrast("button.submit");
accentContrast(".auth-buttons #login-buttons #login-buttons-password");
accentContrast(".btn-primary");
accentContrast(".header .btn-primary");
accentContrast(".header .btn-primary:link");
accentContrast(".header .btn-primary:visited");
accentContrast(".error");
accentContrast(".header a.mobile-menu-button");
accentContrast("login-link-text");
accentContrast(".post-category:hover");

// secondaryColor

secondary(".header", "background-color");

// secondaryContrastColor

secondaryContrast(".header");
secondaryContrast(".header .logo a");
secondaryContrast(".header .logo a:visited");

secondaryContrast(".header .dropdown-top-level", "border-color");
secondaryContrast(".header .dropdown-accordion .show-more", "border-color");
