Telescope.registerModule("adminMenu", {
  route: 'categories',
  label: 'Categories',
  description: 'add_and_remove_categories'
});

// push "categories" modules to postHeading
Telescope.registerModule("postHeading", {
  template: 'postCategories',
  order: 30
});

// push "categoriesMenu" template to primaryNav
Telescope.registerModule("primaryNav", {
  template: 'categoriesMenu',
  order: 50
});

Telescope.registerModule("mobileNav", {
  template: 'categoriesMenu',
  order: 10
});

// we want to wait until categories are all loaded to load the rest of the app
Telescope.config.preloadSubscriptions.push('categories');
