Package.describe({
  summary: "Telescope loupe theme",
  version: '0.1.0',
  name: "telescope-theme-loupe"
});

Package.onUse(function (api) {

  api.use(['fourseven:scss', 'telescope-theme-hubble'], ['client']);

  api.addFiles([
    'lib/client/stylesheets/screen.scss',
    ], ['client']);

});
