Package.describe({
  name: "example-customization"
});

Package.onUse( function(api) {

  api.use([
    'fourseven:scss@3.8.0',

    'example-forum',
  ]);

  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');
  
  api.addFiles([
    'lib/modules.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/stylesheets/custom.scss'
  ], ['client']);

  api.addFiles([
    'lib/server/templates.js'
  ], ['server']);

  api.addAssets([
    'lib/server/emails/customNewPost.handlebars',
    'lib/server/emails/customEmail.handlebars'
  ], ['server']);

});
