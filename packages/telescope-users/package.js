Package.describe({
  name: 'telescope:users',
  summary: 'Telescope permissions.',
  version: '0.1.0'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'accounts-base',
    'telescope:lib@0.3.1',
    'telescope:settings@0.1.0',
    'iron:router@1.0.5',
    'aslagle:reactive-table@0.7.3'
  ]);

  api.addFiles([
    'lib/users.js',
    'lib/hooks.js',
    'lib/helpers.js',
    'lib/permissions.js',
    'lib/pubsub.js',
    'lib/routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/publications.js',
    'lib/server/stuff.js'
  ], ['server']);

  api.export('Users');

});
