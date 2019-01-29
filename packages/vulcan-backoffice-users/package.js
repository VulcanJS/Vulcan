Package.describe({
  name: 'vulcan:backoffice-users',
  description: 'Add users to the backoffice (handles password)',
  version: '1.12.13',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse(api => {
  api.use([
    'vulcan:core',
    'vulcan:users',
    'vulcan:backoffice',
    'vulcan:menu'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
