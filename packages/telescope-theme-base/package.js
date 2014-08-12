Package.describe({summary: "Telescope base theme"});

Package.on_use(function (api) {

  api.add_files([
    'lib/client/css/screen.css',
    ], ['client']);
  
});