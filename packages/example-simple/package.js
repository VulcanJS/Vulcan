Package.describe({
  name: 'example-simple',
});

Package.onUse(function (api) {

  api.use([

    // vulcan core
    'vulcan:core@1.8.3',

    // vulcan packages
    'vulcan:forms@1.8.3',
    'vulcan:accounts@1.8.3',
    
  ]);

  api.addFiles('lib/stylesheets/style.css');
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
