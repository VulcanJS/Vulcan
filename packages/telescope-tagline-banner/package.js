Package.describe({
  name: "telescope:tagline-banner",
  summary: "Show a banner containing your site's tagline on the homepage",
  version: "0.21.1",
});

Package.onUse(function (api) {

  api.versionsFrom("METEOR@1.0");

  // --------------------------- 1. Meteor packages dependencies ---------------------------

  api.use(['telescope:core@0.21.1']);

  // ---------------------------------- 2. Files to include ----------------------------------

  api.addFiles([
    'lib/tagline.js',
    'package-tap.i18n'
  ], ['client', 'server']);

  // client

  api.addFiles([
    'lib/client/templates/tagline_banner.html',
    'lib/client/templates/tagline_banner.js',
    'lib/client/stylesheets/tagline_banner.scss'
  ], ['client']);

  api.addFiles([
    "i18n/en.i18n.json",
    "i18n/fr.i18n.json"
  ], ["client", "server"]);

});
