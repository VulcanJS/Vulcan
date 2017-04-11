Package.describe({
  name: "vulcan:base-styles",
  summary: "Vulcan basic styles package",
  version: '1.3.2',
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'vulcan:core@1.3.2',
    'fourseven:scss@4.5.0',
  ]);

  api.addFiles([
    // 'lib/stylesheets/bootstrap.css',
    'lib/stylesheets/main.scss'
  ], ['client']);

});
