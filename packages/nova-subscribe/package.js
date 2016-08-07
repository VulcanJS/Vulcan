Package.describe({
  name: "nova:subscribe",
  summary: "Subscribe to posts, users, etc. to be notified of new activity",
  version: "0.26.5-nova",
  git: "https://github.com/TelescopeJS/telescope-subscribe-to-posts.git"
});


Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.5-nova',
    'nova:posts@0.26.5-nova',
    'nova:users@0.26.5-nova'
  ]);

  api.mainModule("lib/client.js", ["client"]);
  api.mainModule("lib/server.js", ["server"]);

});
