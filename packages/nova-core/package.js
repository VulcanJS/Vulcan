Package.describe({
  name: "nova:core",
  summary: "Telescope core package",
  version: "0.26.4-nova",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  var packages = [
    'nova:lib@0.26.4-nova', //  no dependencies
    'nova:events@0.26.4-nova' // lib
  ];

  api.use(packages);
  
  api.imply(packages);

  api.addFiles([
    'lib/callbacks.js',
    'lib/icons.js',
    'lib/seo.js',
    'lib/debug.js',
    'lib/router.jsx'
    // 'lib/colors.js' // probably not that useful anymore?
  ], ['client', 'server']);

  api.addAssets([
    // 'public/img/loading.svg',
  ], 'client');

  api.addFiles([
    'lib/server/start.js'
  ], ['server']);

  api.mainModule("lib/export.js", "server");
  api.mainModule("lib/export.js", "client");

});
