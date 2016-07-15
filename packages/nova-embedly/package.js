Package.describe({
  name: "nova:embedly",
  summary: "Telescope Embedly module package",
  version: "0.26.4-nova",
  git: 'https://github.com/TelescopeJS/telescope-embedly.git'
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.4-nova',
    'nova:posts@0.26.4-nova',
    'nova:users@0.26.4-nova',
    'fourseven:scss@3.4.1'
  ]);

  api.addFiles([
    'lib/embedly.js',
    'lib/custom_fields.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/get_embedly_data.js'
  ], ['server']);

  api.addFiles([
    'lib/stylesheets/embedly.scss'
  ], ['client']);

});
