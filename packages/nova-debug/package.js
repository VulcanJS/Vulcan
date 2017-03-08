Package.describe({
  name: "nova:debug",
  summary: "Telescope debug package",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    'fourseven:scss',

    // Nova packages

    'nova:core@1.2.0',
    'nova:posts@1.2.0',
    'nova:users@1.2.0',
    'nova:email@1.2.0',
    'nova:comments@1.2.0'

  ]);

  api.addFiles([
    'lib/stylesheets/debug.scss'
  ], ['client']);

  api.addFiles([
    'lib/components.js',
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
