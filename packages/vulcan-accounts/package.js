Package.describe({
  name: 'vulcan:accounts',
  version: '1.3.2',
  summary: 'Accounts UI for React in Meteor 1.3+',
  git: 'https://github.com/studiointeract/accounts-ui',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  
  api.use('vulcan:core@1.3.2');

  api.use('ecmascript');
  api.use('tracker');
  api.use('underscore');
  api.use('accounts-base');
  api.use('check');
  api.use('random');
  api.use('email');
  api.use('session');

  api.imply('accounts-base');

  api.use('accounts-oauth', {weak: true});
  api.use('accounts-password', {weak: true});

  api.mainModule('main_client.js', 'client');
  api.mainModule('main_server.js', 'server');
});
