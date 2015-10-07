Package.describe({
  name: "telescope:menu",
  summary: "Telescope menu component package",
  version: "0.25.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {
  
  api.versionsFrom("METEOR@1.0");

  api.use([
    'standard-app-packages',
    'fourseven:scss@3.2.0',
    'aldeed:template-extension@3.4.3'
  ]);

  api.addFiles([
    "lib/menu.scss",
    "lib/helpers.js",
    "lib/menu_component.html",
    "lib/menu_component.js",
  ], 'client');

});
