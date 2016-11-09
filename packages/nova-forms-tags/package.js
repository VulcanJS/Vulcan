Package.describe({
  name: "nova:forms-tags",
  summary: "Telescope tag input package",
  version: "0.27.3-nova",
  git: 'https://github.com/TelescopeJS/Telescope.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.27.3-nova',
    'nova:forms@0.27.3-nova'
  ]);

  api.mainModule("lib/export.js", ["client", "server"]);

});
