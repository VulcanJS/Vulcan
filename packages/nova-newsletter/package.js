Package.describe({
  name: "nova:newsletter",
  summary: "Telescope email newsletter package",
  version: "0.27.1-nova",
  git: "https://github.com/TelescopeJS/telescope-newsletter.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.27.1-nova',
    'nova:posts@0.27.1-nova',
    'nova:comments@0.27.1-nova',
    'nova:users@0.27.1-nova',
    'nova:categories@0.27.1-nova',
    'nova:email@0.27.1-nova'
  ]);

  api.mainModule('lib/server.js', 'server');
  api.mainModule('lib/client.js', 'client');

});
