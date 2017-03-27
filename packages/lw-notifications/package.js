Package.describe({
  name: "lw-notifications"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'fourseven:scss',

    'vulcan:core',
    'vulcan:base-components',
    'vulcan:base-styles',
    'vulcan:posts',
    'vulcan:users',
    'vulcan:voting',

    'lw-subscribe',
  ]);

  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');

  api.addFiles([
    'lib/stylesheets/custom.scss'
  ], ['client']);

});
