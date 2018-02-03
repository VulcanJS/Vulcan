Package.describe({
  name: 'example-interfaces',
});

Package.onUse(function (api) {

  api.use([

    'promise',

    // vulcan core
    'vulcan:core@1.8.8',

    // vulcan packages
    'vulcan:forms@1.8.8',
    'vulcan:accounts@1.8.8',
    
  ]);

  api.addFiles('lib/stylesheets/bootstrap.min.css');
  api.addFiles('lib/stylesheets/custom.css');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
