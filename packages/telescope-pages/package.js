Package.describe({
  name: "telescope:pages",
  summary: "Telescope static pages package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use(['telescope:core@0.21.1']);

  api.addFiles([
    'lib/pages.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/routes.js',
    'lib/client/stylesheets/pages.scss',
    'lib/client/templates/page.html',
    'lib/client/templates/page.js',
    'lib/client/templates/page_item.html',
    'lib/client/templates/page_item.js',
    'lib/client/templates/pages.html',
    'lib/client/templates/pages.js',
    'lib/client/templates/pages_menu.html',
    'lib/client/templates/pages_menu.js'
  ], 'client');

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.addFiles([
    "i18n/en.i18n.json"
  ], ["client", "server"]);

  api.export([
    'Pages'
  ]);
});
