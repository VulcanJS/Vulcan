Package.describe({
  name: "vulcan:notifications",
  summary: "Telescope notifications package",
  version: '1.3.2',
  git: "https://github.com/TelescopeJS/telescope-notifications.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.3.2',
    'vulcan:email@1.3.2',
  ]);
  
  api.use([
    'vulcan:posts@1.3.2',
    'vulcan:comments@1.3.2',
  ], {weak: true});

  api.mainModule('lib/modules.js', ['client', 'server']);

});
