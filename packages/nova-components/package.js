Package.describe({
  name: "nova:base-components",
  summary: "Telescope components package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/telescope.git"
});

// Npm.depends({
//   'formsy-react': '0.17.0',
//   'formsy-react-components': '0.6.6',
//   'react-dom': '0.14.7',
//   'react-modal': '0.6.1'
// });

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.7',
    'telescope:posts@0.25.7',
    // 'telescope:i18n@0.25.7',
    // 'telescope:settings@0.25.7',
    'telescope:users@0.25.7',
    'telescope:comments@0.25.7',

    'alt:react-accounts-ui@1.0.0',
    // 'alt:react-accounts-unstyled'
    
  ]);

  api.addFiles([
    'lib/config.js',
    'lib/components.js',
    'lib/routes.jsx'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/accounts.js'
  ], ['client']);


});
