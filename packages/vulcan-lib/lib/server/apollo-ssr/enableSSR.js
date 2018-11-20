/**
 * Actually enable SSR
 */

import {
  populateComponentsApp,
  populateRoutesApp,
  initializeFragments
} from 'meteor/vulcan:lib';
// onPageLoad is mostly equivalent to an Express middleware
// excepts it is tailored to handle Meteor server side rendering
import { onPageLoad } from 'meteor/server-render'

import renderPage from './renderPage'


const enableSSR = () => {
  Meteor.startup(() => {
    // init the application components and routes, including components & routes from 3rd-party packages
    initializeFragments();
    populateComponentsApp();
    populateRoutesApp();
    // render the page
    onPageLoad(renderPage)
  });

}

export default enableSSR

