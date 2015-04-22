Package.describe({
  name: "telescope:core",
  summary: "Telescope core package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
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
    'chuangbo:marked@0.3.5',
    'meteorhacks:fast-render@2.3.2',
    'meteorhacks:subs-manager@1.3.0',
    'telescope:events@0.1.0',
    'telescope:settings@0.1.0',
    'telescope:events@0.1.0',
    'percolatestudio:synced-cron@1.1.0',
    'useraccounts:unstyled@1.8.1'
  ]);

  api.addFiles([
    'lib/router/config.js',
    'lib/router/filters.js',
    'lib/router/admin.js',
    'lib/router/server.js',
    'lib/vote.js',
    'lib/config.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/handlebars.js',
  ], 'client');

  api.addFiles([
    'lib/server/start.js'
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
    "i18n/se.i18n.json",
    "i18n/tr.i18n.json",
    "i18n/vn.i18n.json",
    "i18n/zh-CN.i18n.json"
  ], ["client", "server"]);

  api.export([
    'coreSubscriptions'
  ]);
});
