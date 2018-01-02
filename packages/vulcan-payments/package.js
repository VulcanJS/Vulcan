Package.describe({
  name: 'vulcan:payments',
  summary: "Vulcan payments package",
  version: '1.8.2',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.use([
    'vulcan:core@1.8.2',

    'fourseven:scss@4.5.4',
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

  api.addFiles([
    'lib/stylesheets/style.scss',
  ]);
  
});
