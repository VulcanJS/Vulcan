Package.describe({
  name: "telescope:rss",
  summary: "Telescope RSS package",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-rss.git"
});

Npm.depends({rss: "0.3.2"});

Package.onUse(function (api) {

  api.use([
    'telescope:lib@0.3.0',
    'telescope:settings@0.1.0',
    'telescope:posts@0.1.2'
  ], ['server']);

  api.add_files(['lib/server/rss.js', 'lib/server/routes.js'], ['server']);

  api.export(['serveRSS']);
});
