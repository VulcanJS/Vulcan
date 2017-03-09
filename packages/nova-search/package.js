Package.describe({
  name: "nova:search",
  summary: "Telescope search package",
  version: "1.2.0",
  git: "https://github.com/TelescopeJS/telescope-pages.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['nova:core@1.2.0']);

  api.addFiles([
    'lib/parameters.js',
  ], ['client', 'server']);

});
