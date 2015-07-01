Package.describe({
  name: "telescope:sitemap",
  summary: "Sitemap package for Telescope",
  version: "0.21.1",
  git: "https://github.com/TelescopeJS/telescope-sitemap.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    "telescope:core@0.21.1",
    "gadicohen:sitemaps@0.0.20"
  ]);

  // server
  api.addFiles([
    "lib/server/sitemaps.js"
  ], ["server"]);

});
