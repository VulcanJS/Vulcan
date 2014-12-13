Package.describe({
  name: 'jquery-readmore',
  summary: 'jQuery ReadMore.js',
  version: '0.0.1',
});

Package.on_use(function (api, where) {
  api.use(['jquery'], ['client']);
  api.add_files(['readmore.js/readmore.js'], 'client');
});