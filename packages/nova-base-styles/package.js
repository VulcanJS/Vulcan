Package.describe({
  name: "nova:base-styles",
  summary: "Nova basic styles package",
  version: "0.26.5-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.26.5-nova',
    'fourseven:scss@3.8.0_1',
    // 'juliancwirko:postcss@1.0.0-rc.4',
    // 'seba:minifiers-autoprefixer@0.0.1',
    // 'twbs:bootstrap@=4.0.0-alpha.2'
  ]);

  api.addFiles([
    'lib/stylesheets/bootstrap.css',
    'lib/stylesheets/main.scss'
  ], ['client']);

});
