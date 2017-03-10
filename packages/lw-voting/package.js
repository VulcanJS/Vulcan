Package.describe({
  name: "lw-voting"
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'fourseven:scss',

    'nova:core',
    'nova:base-components',
    'nova:base-styles',
    'nova:posts',
    'nova:users',
    'nova:voting'
  ]);

  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');

  api.addFiles([
    'lib/stylesheets/custom.scss'
  ], ['client']);
  

});