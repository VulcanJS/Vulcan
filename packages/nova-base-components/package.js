Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.25.7',
    'nova:posts@0.25.7',
    'nova:users@0.25.7',
    'nova:comments@0.25.7',
    'nova:share@0.25.7',

    // third-party packages

    'tmeasday:check-npm-versions@0.3.0',
    'std:accounts-ui@1.1.19',
    'utilities:react-list-container',
    'kadira:dochead@1.4.0'
  ]);

  api.addFiles([
    'lib/config.js',
    'lib/components.js',
    'lib/routes.jsx'
  ], ['client', 'server']);

});
