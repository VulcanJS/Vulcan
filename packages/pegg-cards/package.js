Package.describe({
  name: 'pegg-cards',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.2.4');
  api.use([
    'ecmascript',
    'nova:core@0.26.0-nova',
    'nova:posts@0.26.0-nova',
    'nova:users@0.26.0-nova'
    ]);
  api.mainModule('pegg-cards.js');
  api.addFiles('PeggCardPostsPage.jsx', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('pegg-cards');
  api.mainModule('pegg-cards-tests.js');
});
