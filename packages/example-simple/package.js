Package.describe({
  name: 'example-simple',
});

Package.onUse(function (api) {

  api.use([

    // vulcan core
    'vulcan:core@1.8.1',

    // vulcan packages
    'vulcan:forms@1.8.1',
    'vulcan:accounts@1.8.1',
    
  ]);

  api.addFiles('lib/stylesheets/style.css');
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
