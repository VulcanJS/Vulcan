Package.describe("Telescope library package");

Package.on_use(function (api) {

  api.use([
    'underscore'
  ], ['client', 'server']);

  api.use([
    'jquery'
  ], 'client');

  api.add_files(['lib/autolink.js', 'lib/deep_extend.js'], ['client', 'server']);

  api.add_files(['lib/client/jquery.exists.js'], ['client']);
  
  api.export(['deepExtend']);
});