Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "1.0.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    // Nova packages
    'nova:core@1.0.0',
    'nova:posts@1.0.0',
    'nova:users@1.0.0',
    'nova:comments@1.0.0',
    'nova:voting@1.0.0',

    // third-party packages
    'fortawesome:fontawesome@4.5.0',
    'tmeasday:check-npm-versions@0.3.1',
    'std:accounts-ui@1.2.6',
    'utilities:react-list-container@0.1.10',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
