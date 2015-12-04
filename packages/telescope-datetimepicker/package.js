Package.describe({
  name: "telescope:datetimepicker",
  summary: "Custom bootstrap-datetimepicker input type for AutoForm",
  version: "0.25.5",
  git: "https://github.com/TelescopeJS/telescope-datetimepicker.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'telescope:core@0.25.5',
    'tsega:bootstrap3-datetimepicker@4.17.37_1'
  ]);

  api.addFiles([
    'datetimepicker.scss',
    'autoform-bs-datetimepicker.html',
    'autoform-bs-datetimepicker.js',
    'bootstrap-collapse-transitions.js'
  ], 'client');

  api.addAssets([
    'fonts/glyphicons-halflings-regular.eot',
    'fonts/glyphicons-halflings-regular.svg',
    'fonts/glyphicons-halflings-regular.ttf',
    'fonts/glyphicons-halflings-regular.woff'
  ], "client");

});
