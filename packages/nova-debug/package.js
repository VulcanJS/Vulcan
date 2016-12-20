Package.describe({
  name: "nova:debug",
  summary: "Telescope debug package",
  version: "0.3.0-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    'fourseven:scss',

    // Nova packages

    'nova:core@0.3.0-nova',
    'nova:posts@0.3.0-nova',
    'nova:users@0.3.0-nova',
    'nova:email@0.3.0-nova',
    'nova:comments@0.3.0-nova'

  ]);

  api.addFiles([
    'lib/stylesheets/debug.scss'
  ], ['client']);

  api.addFiles([
    'lib/routes.jsx',
    'lib/globals.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/methods.js'
  ], ['server']);

  api.export([
    'Telescope',
    'Posts',
    'Comments',
    'Users',
    'Categories'
  ], ['client', 'server']);

});
