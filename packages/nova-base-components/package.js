Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.27.2-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    // Nova packages
    'nova:core@0.27.2-nova',
    'nova:posts@0.27.2-nova',
    'nova:users@0.27.2-nova',
    'nova:comments@0.27.2-nova',

    // third-party packages
    'fortawesome:fontawesome@4.5.0',
    'tmeasday:check-npm-versions@0.3.1',
    'std:accounts-ui@1.2.6',
    'utilities:react-list-container@0.1.10',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");
  
});
