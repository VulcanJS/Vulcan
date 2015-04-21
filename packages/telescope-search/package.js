Package.describe({
  name: "telescope:search",
  summary: "Telescope search package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'telescope:lib@0.3.0',
    'telescope:settings@0.1.0',
    'aldeed:simple-schema@1.3.2'
  ], ['client', 'server']);

  api.use([
    'jquery',
    'underscore',
    'iron:router@1.0.5',
    'templating',
    'tap:i18n@1.4.1',
    'fourseven:scss@2.1.1'
  ], 'client');

  api.add_files([
    'lib/search.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.add_files([
    'lib/client/routes.js',
    'lib/client/templates/search.html',
    'lib/client/templates/search.js',
    'lib/client/templates/search_logs.html',
    'lib/client/templates/search_logs.js',
    'lib/client/stylesheets/search.scss'
    ], ['client']);

  api.add_files([
    'lib/server/log_search.js',
    'lib/server/publications.js'
    ], ['server']);

  api.add_files([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

  api.export(['Telescope', 'viewParameters']);
});
