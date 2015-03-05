Package.describe({summary: "Telescope i18n package"});

Package.onUse(function (api) {
  api.use(["tap:i18n"], ["client", "server"]);
  api.use(["session"], "client");
  api.add_files(['i18n.js'], ['client', 'server']);
  api.export([
    'i18n',
    'setLanguage'
  ]);
});
