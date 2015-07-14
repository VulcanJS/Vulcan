Package.describe({
  name: "telescope:daily",
  summary: "Telescope daily view",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.21.1',
    'telescope:singleday@0.21.1',
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/daily.js',
    'lib/routes.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/after_day.html',
    'lib/client/templates/before_day.html',
    'lib/client/templates/posts_daily.html',
    'lib/client/templates/posts_daily.js',
    'lib/client/templates/load_more_days.html',
    'lib/client/templates/load_more_days.js',
    'lib/client/stylesheets/daily.scss',
    ], ['client']);

  api.addFiles([
    'lib/server/fastrender.js'
  ], ['server']);

  api.addFiles([
    "i18n/ar.i18n.json",
    "i18n/bg.i18n.json",
    "i18n/de.i18n.json",
    "i18n/el.i18n.json",
    "i18n/en.i18n.json",
    "i18n/es.i18n.json",
    "i18n/fr.i18n.json",
    "i18n/it.i18n.json",
    "i18n/nl.i18n.json",
    "i18n/pl.i18n.json",
    "i18n/pt-BR.i18n.json",
    "i18n/ro.i18n.json",
    "i18n/ru.i18n.json",
    "i18n/sv.i18n.json",
    "i18n/tr.i18n.json",
    "i18n/vi.i18n.json",
    "i18n/zh-CN.i18n.json"
  ], ["client", "server"]);

});
