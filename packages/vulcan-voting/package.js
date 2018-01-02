Package.describe({
  name: "vulcan:voting",
  summary: "Vulcan scoring package.",
  version: '1.8.2',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@1.5.2');

  api.use([
    'fourseven:scss@4.5.0',
    'vulcan:core@1.8.2',
    'vulcan:i18n@1.8.2',
  ], ['client', 'server']);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule("lib/client/main.js", "client");
  
});
