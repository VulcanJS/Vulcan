Package.describe({
  name: "vulcan:core",
  summary: "Telescope core package",
  version: '1.3.2',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:lib@1.3.2',
    'vulcan:users@1.3.2',
    'vulcan:routing@1.3.2'
  ]);

  api.imply([
    'vulcan:lib@1.3.2'
  ]);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
