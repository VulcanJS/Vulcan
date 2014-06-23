Package.describe("Telescope tags package");

Package.on_use(function (api) {

  api.use(['telescope-lib', 'telescope-base', 'simple-schema'], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron-router',
    'templating'
  ], 'client');

  api.add_files(['lib/tags.js'], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/views/categories.html',
    'lib/client/views/categories.js',
    'lib/client/views/category_item.html',
    'lib/client/views/category_item.js',
    'lib/client/views/categories_menu.html',
    'lib/client/views/categories_menu.js'
    ], ['client']);

  api.add_files(['lib/server/publications.js'], ['server']);
  
  api.export(['preloadSubscriptions', 'adminNav', 'Categories', 'addToPostSchema', 'navItems']);
});