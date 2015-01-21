Package.describe({summary: "Telescope tags package"});

Package.onUse(function (api) {

  api.use([
    'telescope-lib', 
    'telescope-base', 
    'aldeed:simple-schema',
    'aldeed:autoform',
    'tap:i18n',
    'fourseven:scss',
    'matb33:collection-hooks'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.add_files([
    'lib/categories.js',
    'lib/custom_fields.js',
    'lib/hooks.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/scss/categories.scss',
    'lib/client/templates/categories.html',
    'lib/client/templates/categories.js',
    'lib/client/templates/category_item.html',
    'lib/client/templates/category_item.js',
    'lib/client/templates/categories_menu.html',
    'lib/client/templates/categories_menu.js',
    'lib/client/templates/post_categories.html',
    'lib/client/templates/post_categories.js'
    ], ['client']);

  api.add_files(['lib/server/publications.js'], ['server']);

  api.add_files([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);
 
  api.export([
    'preloadSubscriptions', 
    'adminMenu', 
    'Categories', 
    'addToPostSchema', 
    'primaryNav', 
    'postModules',
    'getPostCategories'
  ]);
});