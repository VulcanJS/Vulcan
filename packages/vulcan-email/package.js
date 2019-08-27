Package.describe({
  name: 'vulcan:email',
  summary: 'Vulcan email package',
  version: '1.13.2',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:lib@1.13.2']);

  api.mainModule('lib/server.js', 'server');
  api.mainModule('lib/client.js', 'client');
});
