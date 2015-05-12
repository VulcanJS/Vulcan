Package.describe({
  name: 'telescope:users-base',
  summary: 'Telescope users base functionality.',
  version: '0.0.1'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.3.1'
  ]);

  // client + server
  api.addFiles([
    'lib/namespace.js',
    'lib/users.js',
    'lib/helpers.js',
    'lib/pubsub.js'
  ], ['client', 'server']);

  // client
  api.addFiles([

  ], ['client']);

  // server
  api.addFiles([

  ], ['server']);

  api.export('Users');

});
