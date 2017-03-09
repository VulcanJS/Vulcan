Package.describe({
  name: "nova:forms",
  summary: "Form containers for React",
  version: "1.2.0",
  git: "https://github.com/meteor-utilities/react-form-containers.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.3");
  
  api.use([
    'nova:core@1.2.0',
    'nova:users@1.2.0',
    
    'ecmascript',
    'check',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.8.0',
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
    'nova:forms'
  ]);

  api.mainModule('test.js');
});
