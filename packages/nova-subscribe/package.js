Package.describe({
  name: "nova:subscribe",
  summary: "Subscribe to posts, users, etc. to be notified of new activity",
  version: "0.27.1-nova",
  git: "https://github.com/TelescopeJS/telescope-subscribe-to-posts.git"
});


Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.27.1-nova',
    'nova:users@0.27.1-nova', // this dep is needed to check users permissions
    // dependencies on posts, categories are done with nested imports to reduce explicit dependencies
  ]);

  api.mainModule("lib/modules.js", ["client"]);
  api.mainModule("lib/modules.js", ["server"]);

});
