Package.describe({summary: "Telescope tags package"});

Package.onUse(function (api) {

  api.use([
    'telescope-lib', 
    'telescope-base', 
    'aldeed:simple-schema',
    'tap:i18n',
    'fourseven:scss'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router',
    'templating'
  ], 'client');

  api.add_files([
    'lib/tags.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/scss/categories.scss',
    'lib/client/views/categories.html',
    'lib/client/views/categories.js',
    'lib/client/views/category_item.html',
    'lib/client/views/category_item.js',
    'lib/client/views/categories_menu.html',
    'lib/client/views/categories_menu.js',
    'lib/client/views/post_categories.html',
    'lib/client/views/post_categories.js'
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
 
  api.export(['preloadSubscriptions', 'adminNav', 'Categories', 'addToPostSchema', 'primaryNav', 'postModules']);
});