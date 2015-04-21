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
    'telescope:posts@0.1.2',
    'telescope:comments@0.1.0',
    'telescope:settings@0.1.0'
  ], ['client', 'server']);

  api.add_files([
    'lib/scoring.js',
  ], ['client','server']);

  api.add_files([
    'lib/server/cron.js',
  ], ['server']);

  
});