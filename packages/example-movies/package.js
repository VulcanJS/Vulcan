Package.describe({
  name: 'example-movies',
});

Package.onUse(function (api) {

  api.use([
    'nova:core',
    'nova:forms',
    'nova:routing',

    'nova:accounts',
  ]);

  api.addFiles('lib/stylesheets/bootstrap.min.css');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
