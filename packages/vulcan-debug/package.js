Package.describe({
  name: "vulcan:debug",
  summary: "Vulcan debug package",
  version: '1.8.2',
  git: "https://github.com/VulcanJS/Vulcan.git",
  debugOnly: true
});

Package.onUse(function (api) {

  api.versionsFrom('METEOR@1.5.2');

  api.use([

    'fourseven:scss@4.5.0',
    'dynamic-import@0.1.1',

    // Vulcan packages

    'vulcan:lib@1.8.2',
    'vulcan:email@1.8.2',

  ]);

  api.addFiles([
    'lib/stylesheets/debug.scss'
  ], ['client']);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule("lib/client/main.js", "client");

});
