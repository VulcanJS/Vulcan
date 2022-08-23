Package.describe({
  name: 'vulcan:accounts',
  version: '1.16.9',
  summary: 'Accounts UI for React in Meteor 1.3+',
  git: 'https://github.com/studiointeract/accounts-ui',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.use('vulcan:core@=1.16.9');

  api.use('tracker@1.2.0');
  api.use('session@1.2.0');
  api.use('accounts-oauth@1.3.0', { weak: true });
  api.use('accounts-password@2.0.0', { weak: true });
  api.use('service-configuration@1.1.0');
  api.use('accounts-base@2.0.0');

  api.mainModule('main_client.js', 'client');
  api.mainModule('main_server.js', 'server');
});
