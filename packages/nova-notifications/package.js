Package.describe({
  name: "nova:notifications",
  summary: "Telescope notifications package",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/telescope-notifications.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:email@1.2.0',
    'nova:users@1.2.0'
  ]);
  
  api.use([
    'nova:posts@1.2.0',
    'nova:comments@1.2.0',
  ], {weak: true});

  api.mainModule('lib/modules.js', ['client', 'server']);

});
