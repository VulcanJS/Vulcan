Package.describe({
  name: "vulcan:base-components",
  summary: "Telescope components package",
  version: '1.4.0',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    // Vulcan packages
    'vulcan:core@1.4.0',
    'vulcan:posts@1.4.0',
    'vulcan:comments@1.4.0',
    'vulcan:voting@1.4.0',
    'vulcan:accounts@1.4.0',
    'vulcan:categories@1.4.0',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
