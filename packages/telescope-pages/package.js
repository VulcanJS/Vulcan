Package.describe({
  name: "telescope:pages",
  summary: "Telescope static pages package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'aldeed:simple-schema@1.3.2',
    'aldeed:autoform@5.1.2',
    'tap:i18n@1.4.1',
    'fourseven:scss@2.1.1',
    'iron:router@1.0.5',
    'templating',
    'telescope:messages@0.1.0',
    'telescope:lib@0.3.0',
    'matb33:collection-hooks@0.7.11',
    'chuangbo:marked@0.3.5'
  ]);

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
