Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.26.0-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.26.0-nova',
    'nova:posts@0.26.0-nova',
    'nova:users@0.26.0-nova',
    'nova:comments@0.26.0-nova',
    'nova:share@0.26.0-nova',

    // third-party packages

    'tmeasday:check-npm-versions@0.3.0',
    'std:accounts-ui@1.1.19',
    'utilities:react-list-container@0.1.8',
    'kadira:dochead@1.4.0'
  ]);

  api.addFiles([
    'lib/config.js',
    'lib/components.js',
    'lib/router.js',
    'lib/routes.jsx',
  ], ['client', 'server']);

});
