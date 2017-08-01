Package.describe({
  name: "vulcan:categories",
  summary: "Vulcan tags package",
  version: '1.6.1',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.6.1',
    'vulcan:posts@1.6.1',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});