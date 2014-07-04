Package.describe("Telescope Hubble theme");

Package.on_use(function (api) {

  // api.use(['telescope-lib'], ['client', 'server']);

  // api.use([
  //   'jquery',
  //   'underscore',
  //   'templating'
  // ], 'client');

  api.add_files([
    'lib/client/stylesheets/screen.css',
    ], ['client']);
  
});