Package.describe({
  name: 'vulcan:events-intercom',
  summary: 'Vulcan Intercom integration package.',
  version: '1.8.5',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@1.5.2');

  api.use([
    'vulcan:core@1.8.5',
    'vulcan:events@1.8.5'
  ]);

  api.mainModule("lib/client/main.js", "client");
  api.mainModule("lib/server/main.js", "server");

});
