Package.describe({
  name: 'vulcan:cloudinary',
  summary: 'Telescope file upload package.',
  version: '1.3.2',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'vulcan:posts@1.3.2',
    'vulcan:core@1.3.2'
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
