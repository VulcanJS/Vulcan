Package.describe({summary: "Telescope Recently Commented lens"});

Package.on_use(function (api) {

  api.use(['telescope-lib', 'telescope-base'], ['client', 'server']);

  api.add_files(['lib/recently-commented.js'], ['client', 'server']);

  api.add_files(['lib/client/routes.js'], ['client']);
});