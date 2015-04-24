// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Subscriptions -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add a subscription to be preloaded before the rest of the app
Telescope.subscriptions.preload('customPublication');

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------- Nav ------------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add templates to the primary nav bar
Telescope.modules.register("primaryNav", {
  template: 'customNav',
  order: 99
});

// add templates to the secondary nav bar
Telescope.modules.register("secondaryNav", {
  template: 'customNav',
  order: 99
});

// add items to the admin menu
Telescope.modules.register("adminMenu", {
  route: 'customRoute',
  label: 'customAdminLink',
  description: '' // optional
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Zones ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the hero zone (before posts list)
Telescope.modules.register("hero", {
  template: 'customHero',
  order: 99
});

// add templates to the footer (after posts list)
Telescope.modules.register("footer", {
  template: 'customFooter',
  order: 99
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Posts ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the post items
Telescope.modules.register("postItems", {
  template: 'customModule',
  order: 99
});

// add templates to the post heading zone
Telescope.modules.register("postHeading", {
  template: 'customHeading',
  order: 99
});

// add templates to the post meta zone
Telescope.modules.register("postMeta", {
  template: 'customMeta',
  order: 99
});

// ------------------------------------------------------------------------------------------- //
// -------------------------------------- User Profiles -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

Telescope.modules.register("profileDisplay", {
  template: 'customTemplate',
  order: 99
});

Telescope.modules.register("profileEdit", {
  template: 'customTemplate',
  order: 99
});
