Package.describe({
  name: 'vulcan:debug',
  summary: 'Vulcan debug package',
  version: '1.12.17',
  git: 'https://github.com/VulcanJS/Vulcan.git',
  debugOnly: true,
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use([
    'fourseven:scss@4.10.0',
    'dynamic-import@0.1.1',

    // Vulcan packages

    'vulcan:lib@1.12.17',
    'vulcan:email@1.12.17',
  ]);

  api.addFiles(['lib/stylesheets/debug.scss'], ['client']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
