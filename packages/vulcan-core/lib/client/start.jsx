import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';
import AppGenerator from './components/AppGenerator';
import { InjectData } from 'meteor/vulcan:lib';

import {
  createApolloClient,
  populateComponentsApp,
  populateRoutesApp,
  initializeFragments,
} from 'meteor/vulcan:lib';

Meteor.startup(() => {
  // init the application components and routes, including components & routes from 3rd-party packages
  initializeFragments();
  populateComponentsApp();
  populateRoutesApp();
  const apolloClient = createApolloClient();

  // Create the root element
  const rootElement = document.createElement('div');
  rootElement.id = 'react-app';
  document.body.appendChild(rootElement);

  const Main = () => <AppGenerator apolloClient={apolloClient} />;

  onPageLoad(() => {
    const ssrUrl = InjectData.getDataSync('url');
    // in localhost hostname is null
    if (ssrUrl.hostname && ssrUrl.hostname !== window.location.hostname) {
      console.warn(
        `Mismatch between the browser hostname (${
          window.location.hostname
        }) and the hostname used during SSR (${
          ssrUrl.hostname
        }). Will prevent full rehydration of the React DOM.`
      );
    } else {
      ReactDOM.hydrate(<Main />, document.getElementById('react-app'));
    }
  });
});
