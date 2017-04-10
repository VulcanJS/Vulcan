Package.describe({
  name: "vulcan:forms",
  summary: "Form containers for React",
  version: '1.3.2',
  git: "https://github.com/meteor-utilities/react-form-containers.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.3");

  api.use([
    'vulcan:core@1.3.2',

    'fourseven:scss@4.5.0'
  ]);

  api.addFiles([
    "lib/datetime.scss"
  ], "client");

  api.mainModule("lib/export.js", ["client", "server"]);

});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'tinytest',
    'vulcan:forms'
  ]);

  api.mainModule('test.js');
});
