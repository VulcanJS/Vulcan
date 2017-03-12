Package.describe({
  name: "nova:newsletter",
  summary: "Telescope email newsletter package",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/telescope-newsletter.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:posts@1.2.0',
    'nova:comments@1.2.0',
    'nova:users@1.2.0',
    'nova:categories@1.2.0',
    'nova:email@1.2.0'
  ]);

  api.mainModule('lib/server.js', 'server');
  api.mainModule('lib/client.js', 'client');

});
