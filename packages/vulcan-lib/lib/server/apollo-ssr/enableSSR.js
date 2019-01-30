/**
 * Actually enable SSR
 */

import { populateComponentsApp, populateRoutesApp, initializeFragments } from 'meteor/vulcan:lib';
// onPageLoad is mostly equivalent to an Express middleware
// excepts it is tailored to handle Meteor server side rendering
import { onPageLoad } from 'meteor/server-render';

import makePageRenderer from './renderPage';

const enableSSR = ({ computeContext }) => {
  Meteor.startup(() => {
    // init the application components and routes, including components & routes from 3rd-party packages
    initializeFragments();
    populateComponentsApp();
    populateRoutesApp();
    // render the page
    onPageLoad(makePageRenderer({ computeContext }));
  });
};

export default enableSSR;
