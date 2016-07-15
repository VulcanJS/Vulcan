Package.describe({
  name: 'nova:cloudinary',
  summary: 'Telescope file upload package.',
  version: '0.26.4-nova',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:posts@0.26.4-nova',
    'nova:core@0.26.4-nova'
  ]);

  api.use([
    'nova:settings@0.26.1-nova'
  ], {weak: true});

  api.addFiles([
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    
  ], ['client']);

  api.addFiles([
    'lib/server/cloudinary.js'
  ], ['server']);

});
