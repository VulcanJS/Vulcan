Package.describe({
  name: "nova:base-apollo",
  summary: "Nova Apollo Server package",
  version: "0.27.3-nova",
  git: "https://github.com/TelescopeJS/telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([

    // Nova packages

    'nova:core@0.27.3-nova',

  ]);
  
  api.mainModule("lib/client.js", "client"); 
  api.mainModule("lib/export.js", "server"); // client.js inside of export.js for ssr purpose

});
