Package.describe({
  name: 'vulcan:events-segment',
  summary: 'Vulcan Segment',
  version: '1.14.1',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function (api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:core@=1.14.1', 'vulcan:events@=1.14.1']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
