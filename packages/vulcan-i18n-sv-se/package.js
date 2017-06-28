Package.describe({
  name: "vulcan:i18n-sv-se",
  summary: "Telescope i18n package (sv_SE)",
  version: "1.5.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function(api) {
  api.versionsFrom("METEOR@1.0");

  api.use(["vulcan:core@1.5.0"]);

  api.addFiles(["lib/sv_SE.js"], ["client", "server"]);
});
