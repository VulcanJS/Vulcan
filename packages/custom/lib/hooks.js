// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Subscriptions -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add a subscription to be preloaded before the rest of the app
Telescope.config.preloadSubscriptions.push('customPublication');

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------- Nav ------------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add templates to the primary nav bar
Telescope.config.primaryNav.push({
  template: 'customNav',
  order: 99
});

// add templates to the secondary nav bar
Telescope.config.secondaryNav.push({
  template: 'customNav',
  order: 99
});

// add items to the view menu
Telescope.config.viewsMenu.push({
  route: 'customRoute',
  label: 'customViewLink',
  description: '' // optional
});

// add items to the admin menu
Telescope.config.adminMenu.push({
  route: 'customRoute',
  label: 'customAdminLink',
  description: '' // optional
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Zones ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the hero zone (before posts list)
Telescope.config.heroModules.push({
  template: 'customHero',
  order: 99
});

// add templates to the footer (after posts list)
Telescope.config.footerModules.push({
  template: 'customFooter',
  order: 99
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Posts ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the post items
Telescope.config.postModules.push({
  template: 'customModule',
  order: 99
});

// add templates to the post heading zone
Telescope.config.postHeading.push({
  template: 'customHeading',
  order: 99
});

// add templates to the post meta zone
Telescope.config.postMeta.push({
  template: 'customMeta',
  order: 99
});

// ------------------------------------------------------------------------------------------- //
// -------------------------------------- User Profiles -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Telescope.config.userProfileDisplay.push({
  template: 'customTemplate',
  order: 99
});

Telescope.config.userProfileEdit.push({
  template: 'customTemplate',
  order: 99
});
