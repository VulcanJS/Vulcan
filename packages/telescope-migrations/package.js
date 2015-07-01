Package.describe({
  name: "telescope:migrations",
  summary: "Telescope migrations package",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use(['telescope:core@0.21.1']);

  api.addFiles([
    'lib/server/migrations.js'
  ], ['server']);

  api.export([
    'Migrations'
  ]);
});
