Package.describe({
  name: "nova:posts",
  summary: "Telescope posts package",
  version: "0.27.1-nova",
  git: "https://github.com/TelescopeJS/telescope-posts.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.27.1-nova',
    'nova:users@0.27.1-nova',
    'utilities:react-list-container@0.1.10'
  ]);

  api.use([
    'nova:notifications@0.27.1-nova',
    'nova:email@0.27.1-nova'
  ], ['client', 'server'], {weak: true});

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});
