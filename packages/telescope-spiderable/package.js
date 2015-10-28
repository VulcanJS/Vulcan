Package.describe({
  name: "telescope:spiderable",
  summary: "Telescope Spiderable package.",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  api.use(['telescope:core@0.25.5', 'spiderable']);

});
