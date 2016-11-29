Package.describe({
  name: 'framework-demo',
});

Package.onUse(function (api) {

  api.use([
    'nova:core@0.27.4-nova',
    'nova:forms@0.27.4-nova',

    'std:accounts-ui@1.2.9',
  ]);

  api.addFiles('lib/style.css', 'client');
  
  api.mainModule('server.js', 'server');
  api.mainModule('client.js', 'client');
  
});
