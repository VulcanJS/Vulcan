Package.describe({
  name: 'framework-demo',
});

Package.onUse(function (api) {

  api.use([
    'nova:core',
    'nova:forms',

    'std:accounts-ui@1.2.19',
  ]);

  api.addFiles('lib/style.css', 'client');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

  api.export([
    'Movies',
  ], ['client', 'server']);

});
