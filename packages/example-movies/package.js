Package.describe({
  name: 'example-movies',
});

Package.onUse(function (api) {

  api.use([
    'vulcan:core',
    'vulcan:forms',
    'vulcan:routing',
    'vulcan:accounts',
  ]);

  api.addFiles('lib/stylesheets/bootstrap.min.css');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
