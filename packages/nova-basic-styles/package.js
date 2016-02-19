Package.describe({
  name: "nova:basic-styles",
  summary: "Nova basic styles package",
  version: "0.25.7",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.7',
    'nova:base-components'
  ]);

  api.addFiles([
    'lib/stylesheets/solid.1.4.4.css',
    'lib/stylesheets/main.css'
  ], ['client']);


});
