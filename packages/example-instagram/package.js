Package.describe({
  name: 'example-instagram',
});

Package.onUse(function (api) {

  api.use([

    // vulcan core
    'vulcan:core@1.8.3',

    // vulcan packages
    'vulcan:forms@1.8.3',
    'vulcan:accounts@1.8.3',
    'vulcan:forms-upload@1.8.3',
    
    // third-party packages
    'fourseven:scss@4.5.0',

  ]);

  api.addFiles('lib/stylesheets/style.scss');

  api.addAssets([
    'lib/static/vulcanstagram.png'
  ], ['client']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
