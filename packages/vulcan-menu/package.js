Package.describe({
  name: 'vulcan:menu',
  summary: 'Vulcan menu manager',
  version: '1.12.13',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(api => {
  api.use(['vulcan:core', 'vulcan:users']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
