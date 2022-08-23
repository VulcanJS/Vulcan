const version = '1.16.9';

Package.describe({
  name: 'vulcan:core',
  summary: 'Vulcan core package',
  version,
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use([`vulcan:lib@=${version}`, `vulcan:i18n@=${version}`, `vulcan:users@=${version}`]);

  api.use([`vulcan:i18n@=${version}`], ['server', 'client'], { weak: true });

  api.imply([`vulcan:lib@=${version}`]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'meteortesting:mocha', 'vulcan:core', 'vulcan:test', 'vulcan:users']);
  api.mainModule('./test/server/index.js', ['server']);
  api.mainModule('./test/client/index.js', ['client']);
});
