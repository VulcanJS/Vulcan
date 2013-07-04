Package.describe("RSS feed generator");

Npm.depends({rss: '0.0.4'});

Package.on_use(function (api) {
  api.add_files('rss.js', 'server');
});