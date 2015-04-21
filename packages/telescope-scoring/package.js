Package.describe({
  name: "telescope:scoring",
  summary: "Telescope scoring package.",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'telescope:lib@0.3.0',
    'telescope:posts@0.3.2'
  ], ['client', 'server']);

  api.add_files([
    'lib/server/scoring.js',
  ], ['server']);

  api.add_files([
    'lib/server/phone_home.js'
  ], ['server']);

  
});