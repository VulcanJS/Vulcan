Package.describe({
  name: 'vulcan:debug',
  summary: 'Vulcan debug package',
  version: '1.16.9',
  git: 'https://github.com/VulcanJS/Vulcan.git',
  debugOnly: true,
});

Package.onUse(function(api) {
  api.use([
    'fourseven:scss@4.12.0',
    'dynamic-import@0.1.1',

    // Vulcan packages

    'vulcan:lib@=1.16.9',
    'vulcan:email@=1.16.9',
  ]);

  api.use(['vulcan:errors@=1.16.9']), ['server', 'client'], { weak: true };

  api.addFiles(['lib/stylesheets/debug.scss'], ['client']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
