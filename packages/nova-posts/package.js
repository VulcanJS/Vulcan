Package.describe({
  name: "nova:posts",
  summary: "Telescope posts package",
  version: "1.0.0",
  git: "https://github.com/TelescopeJS/telescope-posts.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@1.0.0',
    'nova:events@1.0.0',
    'nova:users@1.0.0',
    'utilities:react-list-container@0.1.10'
  ]);

  api.use([
    'nova:notifications@1.0.0',
    'nova:email@1.0.0'
  ], ['client', 'server'], {weak: true});

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");

});


Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'tinytest',
    'nova:posts',
  ]);
  
  api.mainModule('test.js');
});
