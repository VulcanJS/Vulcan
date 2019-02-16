Package.describe({
  name: 'vulcan:events-ga',
  summary: 'Vulcan Google Analytics event tracking package',
  version: '1.12.17',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@1.12.17', 'vulcan:events@1.12.17']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
