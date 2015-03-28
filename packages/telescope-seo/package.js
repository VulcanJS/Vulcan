Package.describe({
  name: "telescope-seo",
  summary: "SEO extensions for Telescope",
  version: "0.0.5"
});

Package.onUse(function(api) {
  api.use([
    "templating",
    "underscore",
    "aldeed:simple-schema",
    "tap:i18n",
    "iron:router",
    "telescope-lib",
    "telescope-base",
    "telescope-settings",
    "telescope-i18n",
    "manuelschoebel:ms-seo@0.4.1",
    "gadicohen:sitemaps@0.0.20"
  ]);

  // both
  api.addFiles([
    "lib/routes.js",
    "lib/seo.js",
    "package-tap.i18n"
  ], ['client', 'server']);

  // server
  api.addFiles([
    "lib/server/sitemaps.js"
  ], ["server"]);

  // i18n
  api.add_files([
    "i18n/en.i18n.json"
  ], ["client", "server"]);

});
