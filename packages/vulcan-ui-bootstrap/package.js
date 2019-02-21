Package.describe({
  name: 'vulcan:ui-bootstrap',
  summary: 'Vulcan Bootstrap UI components.',
  version: '1.12.17',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');

  api.use(['vulcan:lib@1.12.17', 'fourseven:scss@4.10.0']);

  api.addFiles(['lib/stylesheets/style.scss', 'lib/stylesheets/datetime.scss'], 'client');

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');
});
