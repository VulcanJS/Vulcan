Package.describe({
  name: "telescope-seo",
  summary: "SEO extensions for Telescope",
  version: "0.0.3"
});

Package.onUse(function(api) {

  api.use([
    "underscore",
    "aldeed:simple-schema",
    "iron:router",
    "telescope-lib",
    "telescope-base",
    "telescope-tags",
    "manuelschoebel:ms-seo@0.4.1",
    "gadicohen:sitemaps@0.0.20"
  ]);

  api.export([
  ]);

  api.addFiles("seo.js", ['client', 'server']);
});
