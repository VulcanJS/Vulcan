// packages.js #tutorial-step-2 - Decribes the contents of the package as well as the dependencies. 

Package.describe({
  name: 'example-simple',
});

Package.onUse(function (api) {

  api.use([
    
    // Here are our dependencies:

    // vulcan core
    'vulcan:core@1.8.5',

    // vulcan packages
    'vulcan:forms@1.8.5',
    'vulcan:accounts@1.8.5',
    
  ]);

  api.addFiles('lib/stylesheets/style.css');
  
  // Here is the entry point for client & server:
  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
