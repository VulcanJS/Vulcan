Package.describe({
  name: 'example-movies-full',
});

Package.onUse(function (api) {

  api.use([
    'vulcan:core',
    'vulcan:forms',
    'vulcan:routing',

    'vulcan:accounts',
  ]);

  api.addFiles('lib/stylesheets/bootstrap.min.css', 'client');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

  api.export([
    'Movies',
  ], ['client', 'server']);

});
