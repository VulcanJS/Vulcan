Package.describe({
  name: "telescope:tags",
  summary: "Telescope tags package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-tags.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.21.1']);

  api.addFiles([
    'lib/categories.js',
    'lib/custom_fields.js',
    'lib/hooks.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/routes.js',
    'lib/client/scss/categories.scss',
    'lib/client/templates/categories.html',
    'lib/client/templates/categories.js',
    'lib/client/templates/category_item.html',
    'lib/client/templates/category_item.js',
    'lib/client/templates/category_title.html',
    'lib/client/templates/category_title.js',
    'lib/client/templates/categories_menu.html',
    'lib/client/templates/categories_menu.js',
    'lib/client/templates/posts_category.html',
    'lib/client/templates/post_categories.html',
    'lib/client/templates/post_categories.js'
    ], ['client']);

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/hooks.js',
  ], ['server']);

  api.addFiles([
    "i18n/bg.i18n.json",
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

  api.export([
    'Categories'
  ]);
});
