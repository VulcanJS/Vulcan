Package.describe({
  name: "telescope:i18n",
  summary: "Telescope i18n package",
  version: "0.1.0"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use(["tap:i18n@1.4.1"], ["client", "server"]);

  api.use(["session"], "client");

  api.add_files(['i18n.js'], ['client', 'server']);

  api.export([
    'i18n',
    'setLanguage'
  ]);
});
