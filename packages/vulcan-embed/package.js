Package.describe({
  name: "vulcan:embed",
  summary: "Vulcan Embed package",
  version: '1.10.0',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse( function(api) {

  api.versionsFrom('1.6.1');

  api.use([
    'http',
    'vulcan:core@1.10.0',
    'fourseven:scss@4.5.0'
  ]);


  api.addFiles([
    'lib/stylesheets/embedly.scss'
  ], ['client']);

  api.mainModule('lib/client/main.js', 'client');
  api.mainModule('lib/server/main.js', 'server');

});
