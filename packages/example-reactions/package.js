Package.describe({
  name: 'example-reactions',
});

Package.onUse(function (api) {

  api.use([

    // vulcan core
    'vulcan:core@1.8.3',

    // vulcan packages
    'vulcan:voting@1.8.3',
    'vulcan:forms@1.8.3',
    'vulcan:accounts@1.8.3',
    
  ]);

  api.addFiles('lib/stylesheets/style.css');
  
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
