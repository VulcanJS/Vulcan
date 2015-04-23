// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Subscriptions -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add a subscription to be preloaded before the rest of the app
Telescope.config.preloadSubscriptions.push('customPublication');

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------- Nav ------------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add templates to the primary nav bar
Telescope.registerModule("primaryNav", {
  template: 'customNav',
  order: 99
});

// add templates to the secondary nav bar
Telescope.registerModule("secondaryNav", {
  template: 'customNav',
  order: 99
});

// add items to the admin menu
Telescope.registerModule("adminMenu", {
  route: 'customRoute',
  label: 'customAdminLink',
  description: '' // optional
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Zones ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the hero zone (before posts list)
Telescope.registerModule("hero", {
  template: 'customHero',
  order: 99
});

// add templates to the footer (after posts list)
Telescope.registerModule("footer", {
  template: 'customFooter',
  order: 99
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Posts ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the post items
Telescope.registerModule("postItems", {
  template: 'customModule',
  order: 99
});

// add templates to the post heading zone
Telescope.registerModule("postHeading", {
  template: 'customHeading',
  order: 99
});

// add templates to the post meta zone
Telescope.registerModule("postMeta", {
  template: 'customMeta',
  order: 99
});

// ------------------------------------------------------------------------------------------- //
// -------------------------------------- User Profiles -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Telescope.registerModule("profileDisplay", {
  template: 'customTemplate',
  order: 99
});

Telescope.registerModule("profileEdit", {
  template: 'customTemplate',
  order: 99
});
