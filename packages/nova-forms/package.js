Package.describe({
  name: "nova:forms",
  summary: "Form containers for React",
  version: "0.25.7",
  git: "https://github.com/meteor-utilities/react-form-containers.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.3");
  
  api.use([
    'ecmascript',
    'check',
    'tmeasday:check-npm-versions@0.1.1',
    'aldeed:simple-schema@1.5.3',
    'aldeed:collection2@2.8.0',
    'utilities:smart-methods@0.1.2'
  ]);

  api.mainModule("lib/export.js", ["client", "server"]);

});
