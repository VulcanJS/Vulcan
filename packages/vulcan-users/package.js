Package.describe({
  name: 'vulcan:users',
  summary: 'Vulcan permissions.',
  version: '1.6.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'vulcan:lib@1.6.0'
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
