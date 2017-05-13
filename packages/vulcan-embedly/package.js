Package.describe({
  name: "vulcan:embedly",
  summary: "Telescope Embedly module package",
  version: '1.3.2',
  git: 'https://github.com/TelescopeJS/telescope-embedly.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.3.2',
    'vulcan:posts@1.3.2',
    'fourseven:scss@4.5.0'
  ]);


  api.addFiles([
    'lib/stylesheets/embedly.scss'
  ], ['client']);

  api.mainModule('lib/client/main.js', 'client');
  api.mainModule('lib/server/main.js', 'server');

});
