Package.describe({
  name: 'vulcan:redux',
  summary: 'Add Redux to Vulcan.',
  version: '1.12.8',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@1.12.8']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
