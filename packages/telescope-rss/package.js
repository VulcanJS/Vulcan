Package.describe({summary: "Telescope RSS package"});

Npm.depends({rss: "0.3.2"});

Package.onUse(function (api) {

  api.use(['telescope-base', 'telescope-lib'], ['server']);

  api.add_files(['lib/server/rss.js', 'lib/server/routes.js'], ['server']);
  
  api.export(['serveRSS']);
});