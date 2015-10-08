Package.describe({
  name: "telescope:menu",
  summary: "Telescope menu component package",
  version: "0.25.2",
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
    "lib/helpers.js",
    "lib/menu_component.html",
    "lib/menu_component.js",

    "lib/stylesheets/menu.scss",
    "lib/stylesheets/_common.scss",
    "lib/stylesheets/_collapsible.scss",
    "lib/stylesheets/_dropdown.scss"

  ], 'client');

});
