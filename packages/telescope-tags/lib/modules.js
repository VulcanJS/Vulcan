Telescope.menuItems.add("adminMenu", {
  route: 'adminCategories',
  label: _.partial(i18n.t, 'categories'),
  description: _.partial(i18n.t, 'add_and_remove_categories')
});

// push "categories" modules to postHeading
Telescope.modules.add("postHeading", {
  template: 'post_categories',
  order: 30
});

// push "categories_menu" template to primaryNav
Telescope.modules.add("primaryNav", {
  template: 'categories_menu',
  order: 50
});

Telescope.modules.add("mobileNav", {
  template: 'categories_menu',
  order: 10
});

Telescope.modules.add("postsListTop", {
  template: 'category_title',
  order: 10,
  only: ["postsDefault"]
});

// we want to wait until categories are all loaded to load the rest of the app
Telescope.subscriptions.preload('categories');
