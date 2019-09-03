Package.describe({
  name: 'vulcan:ui-material',
  version: '1.13.0_1',
  summary: 'Replacement for Vulcan (http://vulcanjs.org/) components using material-ui',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.6');

  api.use([
    'ecmascript',
    'vulcan:core@1.13.2',
    'vulcan:accounts@1.13.2',
    'vulcan:forms@1.13.2'
  ]);
  
  api.addFiles([
    'accounts.css',
    'forms.css',
    'en_US.js',
    'fr_FR.js',
  ], ['client', 'server']);

  api.mainModule('lib/client/main.js', 'client');
  api.mainModule('lib/server/main.js', 'server');
});
