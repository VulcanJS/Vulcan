Package.describe({
  name: "vulcan:accounts2-ui",
  summary: "Vulcan accounts package v2",
  version: '1.8.11',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'vulcan:core@1.8.11',
    'vulcan:accounts2@1.8.11',
  ]);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule("lib/client/main.js", "client");
  
});
