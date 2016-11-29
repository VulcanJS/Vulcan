Package.describe({
  name: 'reactrouter:react-router-ssr',
  version: '3.1.6-nova-patch',
  summary: 'Server-side rendering for react-router and react-meteor-data rehydratating Meteor subscriptions',
  git: 'https://github.com/thereactivestack/meteor-react-router-ssr.git',
  documentation: 'README.md'
});

Npm.depends({
  'cookie-parser': '1.4.1',
  'cheerio': '0.20.0',
  'deepmerge': '0.2.10'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use([
    'ecmascript',
    'tracker',
    'minimongo@1.0.0',
    'meteorhacks:fast-render@2.16.0',
    'meteorhacks:inject-data@2.0.1-nova-patch',
    'tmeasday:check-npm-versions@0.2.0'
  ]);

  api.use([
    'underscore@1.0.3',
    'webapp@1.2.0',
    'mongo@1.0.0',
    'routepolicy@1.0.5',
    'url@1.0.9'
  ], 'server');

  api.use([
    'autopublish@1.0.0',
    'tmeasday:publish-counts@0.7.0',
    'promise@0.8.8'
  ], 'server', {weak: true})

  api.export('ReactRouterSSR');
  api.mainModule('lib/react-router-ssr.js');
});
