Package.describe({
  name: "nova:debug",
  summary: "Telescope debug package",
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
    
    'fourseven:scss@3.4.1'

  ]);

  api.addFiles([
    'lib/stylesheets/debug.scss'
  ], ['client']);

  api.addFiles([
    'lib/routes.jsx'
  ], ['client', 'server']);



});
