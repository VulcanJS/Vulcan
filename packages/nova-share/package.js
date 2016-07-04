Package.describe({
  name: "nova:share",
  summary: "Telescope share module package",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/telescope-share.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@0.26.4-nova',
    'fourseven:scss@3.4.1'
  ]);

  api.addFiles([
    'lib/social_share.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/social_share.scss'
  ], ['client'], {isImport:true});
});
