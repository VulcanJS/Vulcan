Package.describe({
  name: 'vulcan:payments',
  summary: "Vulcan payments package",
  version: '1.6.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
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
