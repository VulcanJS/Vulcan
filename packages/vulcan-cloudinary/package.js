Package.describe({
  name: 'vulcan:cloudinary',
  summary: 'Vulcan file upload package.',
  version: '1.6.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'vulcan:posts@1.6.0',
    'vulcan:core@1.6.0'
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
