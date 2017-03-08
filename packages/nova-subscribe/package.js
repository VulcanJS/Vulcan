Package.describe({
  name: "nova:subscribe",
  summary: "Subscribe to posts, users, etc. to be notified of new activity",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/telescope-subscribe-to-posts.git"
});


Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:users@1.2.0', // this dep is needed to check users permissions
    'nova:notifications@1.2.0',
    // dependencies on posts, categories are done with nested imports to reduce explicit dependencies
  ]);
  
  api.use([
    'nova:posts@1.2.0',
    'nova:comments@1.2.0',
    'nova:categories@1.2.0',
  ], {weak: true});

  api.mainModule("lib/modules.js", ["client"]);
  api.mainModule("lib/modules.js", ["server"]);

});
