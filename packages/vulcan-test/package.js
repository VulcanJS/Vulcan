Package.describe({
  name: 'vulcan:test',
  summary: 'Vulcan test helpers',
  version: '1.15.2',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@=1.15.2', 'vulcan:lib@=1.15.2']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
