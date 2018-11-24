Package.describe({
  name: 'vulcan:i18n',
  summary: 'i18n client polyfill',
  version: '1.12.10',
  git: 'https://github.com/VulcanJS/Vulcan'
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:lib@1.12.10',
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
