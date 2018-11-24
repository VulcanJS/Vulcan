Package.describe({
  name: 'vulcan:events-intercom',
  summary: 'Vulcan Intercom integration package.',
  version: '1.12.10',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:core@1.12.10',
    'vulcan:events@1.12.10'
  ]);

  api.mainModule('lib/client/main.js', 'client');
  api.mainModule('lib/server/main.js', 'server');

});
