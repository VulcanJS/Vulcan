import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
checkNpmVersions({
  'react': '15.x',
  'react-dom': '15.x',
  'react-router': '3.x'
}, 'reactrouter:react-router-ssr');

if (Meteor.isClient) {
  ReactRouterSSR = require('./client.jsx').default;
} else {
  ReactRouterSSR = require('./server.jsx').default;
}
