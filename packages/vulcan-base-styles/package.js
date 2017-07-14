Package.describe({
  name: "vulcan:base-styles",
  summary: "Vulcan basic styles package",
  version: '1.5.0',
  git: "https://github.com/VulcanJS/Vulcan.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'vulcan:core@1.5.0',
    'fourseven:scss@4.5.0',
  ]);

  api.addFiles([
    // 'lib/stylesheets/bootstrap.css',
    'lib/stylesheets/main.scss'
  ], ['client']);

});
