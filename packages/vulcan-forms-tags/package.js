Package.describe({
  name: 'vulcan:forms-tags',
  summary: 'Vulcan tag input package',
  version: '1.12.10',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse( function(api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:core@1.12.10',
    'vulcan:forms@1.12.10'
  ]);

  api.mainModule('lib/export.js', ['client', 'server']);

});
