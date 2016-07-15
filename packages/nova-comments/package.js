Package.describe({
  name: "nova:comments",
  summary: "Telescope comments package",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:lib@0.26.4-nova',
    'nova:settings@0.26.4-nova',
    'nova:posts@0.26.4-nova',
    'nova:users@0.26.4-nova'
  ]);

  api.use([
    'nova:notifications@0.26.4-nova',
    'nova:email@0.26.4-nova'
  ], ['client', 'server'], {weak: true});

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
