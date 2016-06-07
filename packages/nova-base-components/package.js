Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.26.2-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.26.2-nova',
    'nova:posts@0.26.2-nova',
    'nova:users@0.26.2-nova',
    'nova:comments@0.26.2-nova',
    'nova:share@0.26.2-nova',

    // third-party packages

    'fortawesome:fontawesome@4.5.0',
    'tmeasday:check-npm-versions@0.3.1',
    'std:accounts-ui@1.1.12',
    'utilities:react-list-container@0.1.8',
    'kadira:dochead@1.5.0'
  ]);

  api.addFiles([
    'lib/config.js',
    'lib/components.js'
  ], ['client', 'server']);

});

Package.onTest(function (api) {
  api.use('nova:base-components');
  api.use('practicalmeteor:mocha@2.4.5_2');
  api.addFiles('lib/common/Vote.tests.js', 'client');
});

// Npm.depends({
//   react: '15.0.1'
// });
