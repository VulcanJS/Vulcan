Package.describe({
  name: "example-customization"
});

Package.onUse( function(api) {

  api.use([
    'vulcan:core',
    'example-forum',

    'fourseven:scss@4.5.0',
  ]);

  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');
  
  api.addFiles([
    'lib/stylesheets/custom.scss'
  ], ['client']);

  api.addAssets([
    'lib/server/emails/customNewPost.handlebars',
    'lib/server/emails/customEmail.handlebars'
  ], ['server']);

});
