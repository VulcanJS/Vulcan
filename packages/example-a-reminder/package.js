Package.describe({
  name: "example-a-reminder"
});

Package.onUse( function(api) {

  api.use([
    'fourseven:scss',
    'vulcan:core',
    'vulcan:users'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

  api.addFiles([
    'lib/modules/index.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/stylesheets/style.scss'
  ], ['client']);

  api.addFiles([
    'lib/server/templates.js'
  ], ['server']);

  api.addAssets([
    'lib/server/emails/reminderEmail.handlebars'
  ], ['server']);

});
