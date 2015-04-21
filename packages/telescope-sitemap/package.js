Package.describe({
  name: "telescope:sitemap",
  summary: "Sitemap package for Telescope",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-sitemap.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    "templating",
    "underscore",
    "iron:router@1.0.5",
    "telescope:lib@0.3.0",
    "telescope:posts@0.1.2",
    "gadicohen:sitemaps@0.0.20"
  ]);

  // server
  api.addFiles([
    "lib/server/sitemaps.js"
  ], ["server"]);

});
