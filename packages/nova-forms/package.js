Package.describe({
  name: "vulcan:forms",
  summary: "Form containers for React",
  version: '1.3.0',
  git: "https://github.com/meteor-utilities/react-form-containers.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.3");

  api.use([
    'vulcan:core@1.3.0',
    'vulcan:users@1.3.0',

    'ecmascript',
    'check',
    'aldeed:collection2-core@2.0.0',
    'fourseven:scss@3.8.0'
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
