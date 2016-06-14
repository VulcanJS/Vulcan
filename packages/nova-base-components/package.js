Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.26.3-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.26.3-nova',
    'nova:posts@0.26.3-nova',
    'nova:users@0.26.3-nova',
    'nova:comments@0.26.3-nova',
    'nova:share@0.26.3-nova',

    // third-party packages

    'fortawesome:fontawesome@4.5.0',
    'tmeasday:check-npm-versions@0.3.1',
    'std:accounts-ui@1.2.6',
    'utilities:react-list-container@0.1.10',
    'kadira:dochead@1.5.0'
  ]);

  api.addFiles([
    'lib/config.js',
    'lib/components.js'
  ], ['client', 'server']);

});
