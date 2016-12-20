Package.describe({
  name: "nova:forms",
  summary: "Form containers for React",
  version: "0.3.0-nova",
  git: "https://github.com/meteor-utilities/react-form-containers.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.3");
  
  api.use([
    'nova:core@0.27.4-nova',
    'nova:users@0.27.4-nova',
    
    'ecmascript',
    'check',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.8.0',
    'fourseven:scss'
  ]);

  api.addFiles([
    "lib/datetime.scss"
  ], "client");

  api.mainModule("lib/export.js", ["client", "server"]);

});
