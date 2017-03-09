Package.describe({
  name: 'nova:cloudinary',
  summary: 'Telescope file upload package.',
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:posts@1.2.0',
    'nova:core@1.2.0'
  ]);

  api.addFiles([
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    
  ], ['client']);

  api.addFiles([
    'lib/server/cloudinary.js'
  ], ['server']);

  api.mainModule("lib/server.js", "server");

});
