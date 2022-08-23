Package.describe({
  name: 'vulcan:voting',
  summary: 'Vulcan scoring package.',
  version: '1.16.9',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.use(['fourseven:scss@4.12.0', 'vulcan:core@=1.16.9', 'vulcan:i18n@=1.16.9'], ['client', 'server']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
