Package.describe({
  name: "nova:embedly",
  summary: "Telescope Embedly module package",
  version: "1.2.0",
  git: 'https://github.com/TelescopeJS/telescope-embedly.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:posts@1.2.0',
    'nova:users@1.2.0',
    'fourseven:scss'
  ]);

  api.addFiles([
    'lib/embedly.js',
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    // 'lib/server/get_embedly_data.js'
    'lib/server/mutations.js'
  ], ['server']);

  api.addFiles([
    'lib/stylesheets/embedly.scss'
  ], ['client']);

});
