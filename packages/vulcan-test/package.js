Package.describe({
  name: 'vulcan:test',
  summary: 'Vulcan test helpers',
  version: '1.16.8',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.8', 'vulcan:lib@=1.16.8']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
