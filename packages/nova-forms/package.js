Package.describe({
  name: "nova:forms",
  summary: "Form containers for React",
  version: "0.27.2-nova",
  git: "https://github.com/meteor-utilities/react-form-containers.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.3");
  
  api.use([
    'ecmascript',
    'check',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.8.0',
    'fourseven:scss@3.9.0'
  ]);

  api.addFiles([
    "lib/datetime.scss"
  ], "client");

  api.mainModule("lib/export.js", ["client", "server"]);

});
