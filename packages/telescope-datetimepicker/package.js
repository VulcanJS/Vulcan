Package.describe({
  name: 'telescope-datetimepicker',
  summary: 'Custom bootstrap-datepicker input type for AutoForm',
  version: '1.0.3',
  git: 'https://github.com/aldeed/meteor-autoform-bs-datepicker.git'
});

Package.onUse(function(api) {
  api.use('templating@1.0.0');
  api.use('blaze@2.0.0');
  api.use('aldeed:autoform@4.0.0');
  api.use('fourseven:scss');
  // api.use('jquery');
  // api.use('tsega:bootstrap3-datetimepicker');
  api.use('chriswessels:glyphicons-halflings');

  api.addFiles([
    'datetimepicker.scss',
    'autoform-bs-datepicker.html',
    'autoform-bs-datepicker.js',
    'bootstrap-collapse-transitions.js',
    'fonts/glyphicons-halflings-regular.eot',
    'fonts/glyphicons-halflings-regular.svg',
    'fonts/glyphicons-halflings-regular.ttf',
    'fonts/glyphicons-halflings-regular.woff'
  ], 'client');
});
