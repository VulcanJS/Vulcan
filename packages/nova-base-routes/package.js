Package.describe({
  name: "nova:base-routes",
  summary: "Nova routes package",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.26.4-nova',
    'nova:posts@0.26.4-nova',
    'nova:users@0.26.4-nova',
    'nova:comments@0.26.4-nova',

    // third-party packages

    'utilities:react-list-container@0.1.10'
  ]);

  api.addFiles([
    'lib/routes.jsx'
  ], ['client', 'server']);

});
