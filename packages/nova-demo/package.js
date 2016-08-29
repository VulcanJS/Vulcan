Package.describe({
  name: "nova:demo",
  summary: "Telescope components package",
  version: "0.27.0-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages
    
    'nova:core@0.27.0-nova',
    'utilities:react-list-container@0.1.10',
    'utilities:smart-publications@0.1.4',

    // third-party packages

    // 'alt:react-accounts-ui@1.1.0'
  ]);

  api.addFiles([
    'demo-app.jsx'
  ], ['client', 'server']);

  api.export([
    "Movies"
  ], ['client', 'server'])
});
