Package.describe({
  name: 'example-instagram',
});

Package.onUse(function (api) {

  api.use([

    // vulcan packages
    'vulcan:core',
    'vulcan:forms',
    'vulcan:routing',
    'vulcan:accounts',
    'vulcan:forms-upload',
    
    // third-party packages
    'fourseven:scss',

  ]);

  api.addFiles('lib/stylesheets/style.scss');

  api.addAssets([
    'lib/static/vulcanstagram.png'
  ], ['client']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
