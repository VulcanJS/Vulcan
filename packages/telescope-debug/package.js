Package.describe({
  name: "telescope:debug",
  summary: "Telescope debug package",
  version: "0.23.0",  
  git: "https://github.com/TelescopeJS/Telescope.git",
  debugOnly: true
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use(['telescope:core@0.23.0']);

  api.addFiles([
    'lib/debug.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates.js',
    'lib/client/stylesheets/highlight.scss'
  ], ['client']);

});
