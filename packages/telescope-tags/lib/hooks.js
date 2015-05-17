Telescope.menus.add("adminMenu", {
  route: 'categories',
  label: 'Categories',
  description: 'add_and_remove_categories'
});

// push "categories" modules to postHeading
Telescope.modules.add("postHeading", {
  template: 'postCategories',
  order: 30
});

// push "categoriesMenu" template to primaryNav
Telescope.modules.add("primaryNav", {
  template: 'categoriesMenu',
  order: 50
});

Telescope.modules.add("mobileNav", {
  template: 'categoriesMenu',
  order: 10
});

// we want to wait until categories are all loaded to load the rest of the app
Telescope.subscriptions.preload('categories');
