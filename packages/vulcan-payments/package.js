Package.describe({
  name: 'vulcan:payments',
});

Package.onUse(function (api) {

  api.use([
    'vulcan:core',

    'fourseven:scss',
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

  api.addFiles([
    'lib/stylesheets/style.scss',
  ]);
  
});
