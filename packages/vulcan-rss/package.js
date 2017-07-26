Package.describe({
  name: "vulcan:rss",
  summary: "Vulcan RSS package",
  version: '1.6.0',
  git: "https://github.com/TelescopeJS/telescope-rss.git"
});

Npm.depends({rss: "1.1.1"});

Package.onUse(function (api) {

  api.use([
    'vulcan:core@1.6.0',
    'vulcan:posts@1.6.0',
    'vulcan:comments@1.6.0'
  ]);

  api.addFiles(['lib/headtags.js'], ['client', 'server']);

  api.addFiles(['lib/server/rss.js', 'lib/server/routes.js'], ['server']);

});