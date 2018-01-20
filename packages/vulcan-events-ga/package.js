Package.describe({
  name: "vulcan:events-ga",
  summary: "Vulcan Google Analytics event tracking package",
  version: '1.8.4',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function(api) {

  api.versionsFrom('METEOR@1.5.2');
  
  api.use([
    'vulcan:core@1.8.4',
    'vulcan:events@1.8.4',
  ]);

  api.mainModule("lib/server/main.js", "server");
  api.mainModule('lib/client/main.js', 'client');

});
