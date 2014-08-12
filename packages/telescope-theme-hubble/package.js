Package.describe({summary: "Telescope Hubble theme"});

Package.on_use(function (api) {

  api.add_files([
    'lib/client/css/screen.css',
    ], ['client']);
  
});