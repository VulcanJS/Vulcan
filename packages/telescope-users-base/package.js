Package.describe({
  name: 'telescope:users-base',
  summary: 'Telescope users base functionality.',
  version: '0.0.1'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

  ]);

  // client + server
  api.addFiles([
    'lib/namespace.js'
  ], ['client', 'server']);

  // client
  api.addFiles([

  ], ['client']);

  // server
  api.addFiles([

  ], ['server']);

  api.export('Users');

});
