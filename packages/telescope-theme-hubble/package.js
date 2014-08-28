Package.describe({summary: "Telescope Hubble theme"});

Package.onUse(function (api) {

  api.use(['telescope-lib', 'telescope-base'], ['client', 'server']);

  api.add_files([
    'lib/hubble.js',
    ], ['client', 'server']);

  api.add_files([
    'lib/client/css/screen.css',
    ], ['client']);
  
});