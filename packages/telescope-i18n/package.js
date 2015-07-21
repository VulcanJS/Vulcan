Package.describe({
  name: "telescope:i18n",
  summary: "Telescope i18n package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use(['telescope:lib@0.21.1']);

  api.use(["session"], "client");

  api.addFiles(['i18n.js'], ['client', 'server']);

  api.export([
    'i18n'
  ]);
});
