Package.describe({
  name: "nova:search",
  summary: "Telescope search package",
  version: "0.27.0-nova",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['nova:core@0.27.0-nova']);

  api.addFiles([
    'lib/parameters.js',
  ], ['client', 'server']);

});
