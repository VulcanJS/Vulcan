Package.describe({
  name: "nova:voting",
  summary: "Telescope scoring package.",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['nova:core@0.26.4-nova']);

  api.use([
    'nova:posts@0.26.4-nova', 
    'nova:comments@0.26.4-nova'
  ], ['client', 'server']);

  api.addFiles([
    'lib/scoring.js',
    'lib/vote.js',
    'lib/custom_fields.js'
  ], ['client','server']);

  api.addFiles([
    'lib/server/cron.js',
  ], ['server']);


});
