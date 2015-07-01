Package.describe({
  name: "telescope:search",
  summary: "Telescope search package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.21.1']);

  api.addFiles([
    'lib/search.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/routes.js',
    'lib/client/templates/search.html',
    'lib/client/templates/search.js',
    'lib/client/templates/search_logs.html',
    'lib/client/templates/search_logs.js',
    'lib/client/stylesheets/search.scss'
    ], ['client']);

  api.addFiles([
    'lib/server/log_search.js',
    'lib/server/publications.js'
    ], ['server']);

  api.addFiles([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

});
