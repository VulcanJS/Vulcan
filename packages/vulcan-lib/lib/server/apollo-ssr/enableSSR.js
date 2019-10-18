/**
 * Actually enable SSR
 */

import { runCallbacks, populateComponentsApp, populateRoutesApp, initializeFragments } from 'meteor/vulcan:lib';
// onPageLoad is mostly equivalent to an Express middleware
// excepts it is tailored to handle Meteor server side rendering
import { onPageLoad } from 'meteor/server-render';

import makePageRenderer from './renderPage';

const enableSSR = ({ computeContext }) => {
  Meteor.startup(() => {
    runCallbacks('populate.before');
    // init the application components and routes, including components & routes from 3rd-party packages
    initializeFragments();
    populateComponentsApp();
    populateRoutesApp();
    // render the page
    onPageLoad(makePageRenderer({ computeContext }));
  });
};

export default enableSSR;
