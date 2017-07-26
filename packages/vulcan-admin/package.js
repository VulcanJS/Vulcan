Package.describe({
  name: "vulcan:admin",
  summary: "Vulcan components package",
  version: '1.6.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    'fourseven:scss@4.5.0',
    'dynamic-import',
    // Vulcan packages
    'vulcan:core@1.6.0',

  ]);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule("lib/client/main.js", "client");

  api.addFiles([
    'lib/stylesheets/style.scss'
  ], ['client']);
  
});
