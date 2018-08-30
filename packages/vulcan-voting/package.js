Package.describe({
  name: "vulcan:voting",
  summary: "Vulcan scoring package.",
  version: '1.12.1',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('1.6.1');

  api.use([
    'fourseven:scss@4.5.0',
    'vulcan:core@1.12.1',
    'vulcan:i18n@1.12.1',
  ], ['client', 'server']);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule("lib/client/main.js", "client");
  
});
