Package.describe({
  name: "vulcan:subscribe",
  summary: "Subscribe to posts, users, etc. to be notified of new activity",
  version: '1.6.0',
  git: "https://github.com/TelescopeJS/telescope-subscribe-to-posts.git"
});


Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'vulcan:core@1.6.0',
    'vulcan:notifications@1.6.0',
    // dependencies on posts, categories are done with nested imports to reduce explicit dependencies
  ]);
  
  api.use([
    'vulcan:posts@1.6.0',
    'vulcan:comments@1.6.0',
    'vulcan:categories@1.6.0',
  ], {weak: true});

  api.mainModule("lib/modules.js", ["client"]);
  api.mainModule("lib/modules.js", ["server"]);

});
