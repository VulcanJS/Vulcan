Package.describe({
  name: "telescope-seo",
  summary: "SEO extensions for Telescope",
  version: "0.0.1"
});

Package.onUse(function(api) {

  api.use([
    "underscore",
    "aldeed:simple-schema",
    "iron:router",
    "telescope-lib",
    "telescope-base",
    "telescope-tags",
    "manuelschoebel:ms-seo@0.3.0", // Need version compatible with Iron:Router < 1.0
    "gadicohen:sitemaps@0.0.20"
  ]);

  api.export([
  ]);

  api.addFiles("seo.js", ['client', 'server']);
});
