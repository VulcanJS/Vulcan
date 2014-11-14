Package.describe({summary: "Telescope base theme"});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base'], ['client', 'server']);
  
  api.add_files([
    'lib/client/css/screen.css',
    ], ['client']);
  
});