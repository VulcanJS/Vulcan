Package.describe({
  name: "nova:comments",
  summary: "Telescope comments package",
  version: "0.3.0-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.3.0-nova',
    'nova:posts@0.3.0-nova',
    'nova:users@0.3.0-nova'
  ]);

  api.use([
    'nova:notifications@0.3.0-nova',
    'nova:email@0.3.0-nova'
  ], ['client', 'server'], {weak: true});

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
