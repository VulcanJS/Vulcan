Package.describe({
  name: "vulcan:forms-tags",
  summary: "Vulcan tag input package",
  version: '1.6.0',
  git: 'https://github.com/VulcanJS/Vulcan.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.6.0',
    'vulcan:forms@1.6.0'
  ]);

  api.mainModule("lib/export.js", ["client", "server"]);

});
