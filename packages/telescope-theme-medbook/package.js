Package.describe({summary: "Telescope MedBook theme"});

Package.on_use(function (api) {

  api.use(['telescope-base', 'telescope-theme-hubble', 'templating'], ['client']);

  api.add_files([
    'lib/client/stylesheets/screen.css',
    'lib/client/templates/new_posts_list.html',
    'lib/client/medbook.js',
    ], ['client']);
  
});
