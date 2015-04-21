Package.describe({
  name: "telescope:migrations",
  summary: "Telescope migrations package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'telescope:lib@0.3.0',
    'telescope:users@0.1.0',
    'telescope:comments@0.1.0',
    'telescope:posts@0.1.2'
  ]);

  api.addFiles([
    'lib/server/migrations.js'
  ], ['server']);

  api.export([
    'Migrations'
  ]);
});
