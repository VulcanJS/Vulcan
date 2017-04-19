Package.describe({
  name: "example-a-reminder"
});

Package.onUse( function(api) {

  api.use([
    'fourseven:scss',
    'vulcan:core',
    'vulcan:base-components',
    'vulcan:users'
  ]);

  // api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');

  // api.addFiles([
  //   'lib/modules.js'
  // ], ['client', 'server']);

  api.addFiles([
    'lib/stylesheets/style.scss'
  ], ['client']);

  // api.addFiles([
  //   'lib/server/templates.js'
  // ], ['server']);

  api.addAssets([
    'lib/server/emails/reminderEmail.handlebars'
  ], ['server']);

});
