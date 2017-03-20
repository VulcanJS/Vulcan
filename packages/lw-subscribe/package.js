Package.describe({
  name: "lw-subscribe",
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.2.0',
    'nova:users@1.2.0', // this dep is needed to check users permissions
    'nova:posts@1.2.0',
    'nova:comments@1.2.0',
    'nova:categories@1.2.0',
    'lw-notifications',
  ]);

  api.mainModule("lib/modules.js", ["client"]);
  api.mainModule("lib/modules.js", ["server"]);

});
