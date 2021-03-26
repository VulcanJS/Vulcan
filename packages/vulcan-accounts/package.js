Package.describe({
  name: 'vulcan:accounts',
  version: '1.16.3',
  summary: 'Accounts UI for React in Meteor 1.3+',
  git: 'https://github.com/studiointeract/accounts-ui',
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.use('vulcan:core@=1.16.3');

  api.use('tracker@1.2.0');
  api.use('session@1.2.0');
  api.use('accounts-oauth@1.2.0', { weak: true });
  api.use('accounts-password@1.7.0', { weak: true });
  api.use('service-configuration@1.0.11');
  api.use('accounts-base@1.8.0');

  api.mainModule('main_client.js', 'client');
  api.mainModule('main_server.js', 'server');
});
