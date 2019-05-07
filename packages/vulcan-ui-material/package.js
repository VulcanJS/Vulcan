Package.describe({
  name: 'vulcan:ui-material',
  version: '1.13.0',
  summary: 'Replacement for Vulcan (http://vulcanjs.org/) components using material-ui',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.6');

  api.use([
    'ecmascript',
    'vulcan:core@1.12.8',
    'vulcan:accounts@1.12.8',
    'vulcan:forms@1.12.8'
  ]);
  
  api.addFiles([
    'accounts.css', 
    'forms.css', 
  ], ['client', 'server']);

  api.mainModule('lib/client/main.js', 'client');
  api.mainModule('lib/server/main.js', 'server');
});