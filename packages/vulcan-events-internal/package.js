Package.describe({
  name: 'vulcan:events-internal',
  summary: 'Vulcan internal event tracking package',
  version: '1.16.5',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['vulcan:core@=1.16.5', 'vulcan:events@=1.16.5']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
