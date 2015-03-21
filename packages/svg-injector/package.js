Package.describe({
  summary: "SVG Injector package",
  version: '0.0.1',
  name: "svg-injector"
});

Package.onUse(function (api) {

  api.add_files([
    "svg-injector.min.js",
  ], ["client"]);

});