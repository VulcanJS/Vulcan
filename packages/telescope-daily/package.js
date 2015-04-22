Package.describe({
  name: "telescope:daily",
  summary: "Telescope daily view",
  version: "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.1.0',
    'telescope:singleday@0.1.0',
  ]);

  api.add_files([
    'package-tap.i18n',
    'lib/daily.js',
    'lib/routes.js',
  ], ['client', 'server']);

  api.add_files([
    'lib/client/templates/posts_daily.html',
    'lib/client/templates/after_day.html',
    'lib/client/templates/before_day.html',
    'lib/client/templates/posts_daily.js',
    'lib/client/stylesheets/daily.scss',
    ], ['client']);

  api.add_files([
    "i18n/de.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/zh-CN.i18n.json",
  ], ["client", "server"]);

});
