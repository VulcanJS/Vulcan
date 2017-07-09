Package.describe({
  name: "lesswrong",
  summary: "Lesswrong extensions and customizations package",
  version: "0.1.0"
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'fourseven:scss',
    'vulcan:core',
    'vulcan:base-components',
    'vulcan:base-styles',
    'vulcan:posts',
    'vulcan:users',
    'vulcan:voting',
  ]);

  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');

  api.addFiles([
    'lib/stylesheets/bootstrap.scss',
    'lib/stylesheets/custom.scss',
    'lib/stylesheets/comments.scss',
    'lib/stylesheets/editor.scss',
  ], ['client']);

  api.addAssets([
    'assets/Logo.png',
  ], ['client']);


});
