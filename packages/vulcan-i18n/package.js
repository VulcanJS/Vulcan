Package.describe({
  name: 'vulcan:i18n',
  summary: "i18n client polyfill",
  version: '1.8.2',
  git: "https://github.com/VulcanJS/Vulcan"
});

Package.onUse(function (api) {

  api.use([
    'vulcan:lib@1.8.2',
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
