Package.describe({
  name: "vulcan:categories",
  summary: "Vulcan tags package",
  version: '1.5.0',
  git: "https://github.com/TelescopeJS/telescope-tags.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.5.0',
    'vulcan:posts@1.5.0',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});