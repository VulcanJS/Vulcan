// ------------------------------------------------------------------------------------------- //
// -------------------------------------- Subscriptions -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add a subscription to be preloaded before the rest of the app
preloadSubscriptions.push('customPublication');

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------- Nav ------------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// add templates to the primary nav bar  
primaryNav.push({
  template: 'customNav',
  order: 99
});

// add templates to the secondary nav bar
secondaryNav.push({
  template: 'customNav',
  order: 99
});

// add items to the view menu
viewsMenu.push({
  route: 'customRoute',
  label: 'customViewLink',
  description: '' // optional
});

// add items to the admin menu
adminMenu.push({
  route: 'customRoute',
  label: 'customAdminLink',
  description: '' // optional
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Zones ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the hero zone (before posts list)
heroModules.push({
  template: 'customHero',
  order: 99
});
  
// add templates to the footer (after posts list)
footerModules.push({
  template: 'customFooter',
  order: 99
});

// ------------------------------------------------------------------------------------------- //
// ------------------------------------------ Posts ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

// add templates to the post items
postModules.push({
  template: 'customModule',
  order: 99
});

// add templates to the post heading zone
postHeading.push({
  template: 'customHeading',
  order: 99
});

// add templates to the post meta zone
postMeta.push({
  template: 'customMeta',
  order: 99 
});

// ------------------------------------------------------------------------------------------- //
// -------------------------------------- User Profiles -------------------------------------- //
// ------------------------------------------------------------------------------------------- //

userProfileDisplay.push({
  template: 'customTemplate',
  order: 99 
});

userProfileEdit.push({
  template: 'customTemplate',
  order: 99 
});