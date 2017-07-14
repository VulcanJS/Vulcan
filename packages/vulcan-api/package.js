Package.describe({
  name: "vulcan:api",
  summary: "Vulcan API package",
  version: '1.6.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'vulcan:core@1.6.0',
    'vulcan:posts@1.6.0',
    'vulcan:comments@1.6.0'
  ]);

  api.mainModule("lib/server.js", "server");
  // api.mainModule("lib/client.js", "client");

});
