Package.describe({
  name: "vulcan:debug",
  summary: "Vulcan debug package",
  version: '1.7.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    'fourseven:scss@4.5.0',
    'dynamic-import@0.1.1',

    // Vulcan packages

    'vulcan:core@1.7.0',
    // 'vulcan:posts@1.7.0',
    'vulcan:email@1.7.0',
    // 'vulcan:comments@1.7.0'

  ]);

  api.addFiles([
    'lib/stylesheets/debug.scss'
  ], ['client']);

  api.addFiles([
    'lib/components.js',
    'lib/routes.jsx',
    // 'lib/globals.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/methods.js'
  ], ['server']);

  // api.export([
  //   'Telescope',
  //   'Posts',
  //   'Comments',
  //   'Users',
  //   'Categories'
  // ], ['client', 'server']);

});
