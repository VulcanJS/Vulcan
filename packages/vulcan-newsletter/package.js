Package.describe({
  name: 'vulcan:newsletter',
  summary: 'Vulcan email newsletter package',
  version: '1.12.12',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:core@1.12.12',
    'vulcan:email@1.12.12'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
