Package.describe({
  name: "telescope:datetimepicker",
  summary: "Custom bootstrap-datetimepicker input type for AutoForm",
  version: "0.1.0",
  git: "https://github.com/TelescopeJS/telescope-datetimepicker.git"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use('telescope:core@0.1.0');
  api.use('templating');
  api.use('blaze');
  api.use('aldeed:autoform@5.1.2');
  api.use('fourseven:scss@2.1.1');

  api.addFiles([
    'datetimepicker.scss',
    'autoform-bs-datetimepicker.html',
    'autoform-bs-datetimepicker.js',
    'bootstrap-collapse-transitions.js',
    'fonts/glyphicons-halflings-regular.eot',
    'fonts/glyphicons-halflings-regular.svg',
    'fonts/glyphicons-halflings-regular.ttf',
    'fonts/glyphicons-halflings-regular.woff'
  ], 'client');
});
