Package.describe({
  name: "nova-demo",
  summary: "Telescope components package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages
    
    'nova:core@0.25.7',
    'utilities:smart-publications',
    'utilities:smart-methods',
    'modules',

    // third-party packages

    'alt:react-accounts-ui@1.0.0'
  ]);

  api.addFiles([
    'demo-component.jsx',
    'demo-app.jsx'
  ], ['client', 'server']);

  api.export([
    "Movies"
  ], ['client', 'server'])
});
