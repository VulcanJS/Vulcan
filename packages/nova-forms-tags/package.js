Package.describe({
  name: "nova:forms-tags",
  summary: "Telescope tag input package",
  version: "1.2.0",
  git: 'https://github.com/TelescopeJS/Telescope.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:forms@1.2.0'
  ]);

  api.mainModule("lib/export.js", ["client", "server"]);

});
