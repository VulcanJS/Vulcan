Package.describe({
  name: "nova:debug",
  summary: "Telescope debug package",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    'fourseven:scss@3.4.1',

    // Nova packages

    'nova:core@0.26.4-nova',
    'nova:posts@0.26.4-nova',
    'nova:users@0.26.4-nova',
    'nova:email@0.26.4-nova',
    'nova:comments@0.26.4-nova'

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
    'Posts',
    'Comments',
    'Users'
  ], ['client', 'server']);

});
