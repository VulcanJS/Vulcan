Package.describe({
  name: 'vulcan:places',
  summary: 'Google Maps Places package.',
  version: '1.3.2',
  git: 'https://github.com/vulcanjs/vulcan.git'
});

Package.onUse( function(api) {

  api.versionsFrom('METEOR@1.0');

  api.use([
    'vulcan:core@1.3.2',
    'vulcan:forms@1.3.2',
    'fourseven:scss@4.5.0'
  ]);

  api.addFiles([
    'lib/style.scss'
  ], 'client');

  api.mainModule('lib/client/main.js', 'client');
  api.mainModule('lib/server/main.js', 'server');

});
