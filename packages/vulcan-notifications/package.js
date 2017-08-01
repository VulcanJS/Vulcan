Package.describe({
  name: "vulcan:notifications",
  summary: "Vulcan notifications package",
  version: '1.6.1',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.6.1',
    'vulcan:email@1.6.1',
  ]);
  
  api.use([
    'vulcan:posts@1.6.1',
    'vulcan:comments@1.6.1',
  ], {weak: true});

  api.mainModule('lib/modules.js', ['client', 'server']);

});
