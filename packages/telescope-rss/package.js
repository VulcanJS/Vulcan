Package.describe("Telescope RSS package");

Package.on_use(function (api) {

  api.use(['telescope-base', 'telescope-lib', 'rss'], ['server']);

  api.add_files(['lib/server/rss.js', 'lib/server/routes.js'], ['server']);
  
  api.export(['serveRSS']);
});