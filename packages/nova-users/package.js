Package.describe({
  name: 'nova:users',
  summary: 'Telescope permissions.',
  version: '0.27.4-nova',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:lib@0.27.4-nova',
    'nova:email@0.27.4-nova'
  ]);
  
  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
