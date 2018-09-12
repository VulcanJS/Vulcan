Package.describe({
  name: 'vulcan:ui-bootstrap',
  summary: 'Vulcan Bootstrap UI components.',
  version: '1.12.6',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:lib@1.12.6'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
