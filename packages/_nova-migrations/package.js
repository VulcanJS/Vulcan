Package.describe({
  name: "migrations",
  summary: "Telescope migrations package",
  version: "0.27.0-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use(['nova:core@0.27.0-nova']);

  api.addFiles([
    'lib/server/migrations.js'
  ], ['server']);

  api.export([
    'Migrations'
  ]);
});
