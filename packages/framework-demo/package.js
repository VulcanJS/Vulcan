Package.describe({
  name: 'framework-demo',
});

Package.onUse(function (api) {

  api.use([
    'nova:core@1.0.0',
    'nova:forms@1.0.0',

    'std:accounts-ui@1.2.18',
  ]);

  api.addFiles('lib/style.css', 'client');

  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');

});
