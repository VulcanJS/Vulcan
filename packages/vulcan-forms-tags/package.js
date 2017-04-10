Package.describe({
  name: "vulcan:forms-tags",
  summary: "Telescope tag input package",
  version: '1.3.2',
  git: 'https://github.com/TelescopeJS/Telescope.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.3.2',
    'vulcan:forms@1.3.2'
  ]);

  api.mainModule("lib/export.js", ["client", "server"]);

});
