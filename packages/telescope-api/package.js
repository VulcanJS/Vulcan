Package.describe({summary: "Telescope API package"});

Package.on_use(function (api) {

  api.use(['telescope-base', 'telescope-lib'], ['server']);

  api.add_files(['lib/server/api.js', 'lib/server/routes.js'], ['server']);

  api.export(['serveAPI']);

});