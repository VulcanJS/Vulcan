Package.describe({
  name: "nova:forms",
  summary: "Form containers for React",
  version: "0.26.2-nova",
  git: "https://github.com/meteor-utilities/react-form-containers.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.3");
  
  api.use([
    'ecmascript',
    'check',
    'tmeasday:check-npm-versions@0.3.1',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.8.0',
    'utilities:smart-methods@0.1.4',
    'fourseven:scss@3.4.1'
  ]);

  api.addFiles([
    "lib/datetime.scss"
  ], "client");

  api.mainModule("lib/export.js", ["client", "server"]);

});
