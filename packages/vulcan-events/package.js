Package.describe({
  name: 'vulcan:events',
  summary: 'Vulcan event tracking package',
  version: '1.16.3',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.3']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
