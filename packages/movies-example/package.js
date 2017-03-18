Package.describe({
  name: 'framework-demo-2',
});

Package.onUse(function (api) {

  api.use([
    'nova:core',
    'nova:forms',
    'nova:routing',
    'nova:users',

    'std:accounts-ui@1.2.19',
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
