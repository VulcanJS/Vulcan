import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';
import { ApolloProvider } from 'react-apollo';
import { CookiesProvider } from 'react-cookie';

import {
  createApolloClient,
  Components,
  populateComponentsApp,
  populateRoutesApp,
  initializeFragments
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

  const Main = () => (
    <ApolloProvider client={apolloClient}>
      <CookiesProvider>
        <Components.App />
      </CookiesProvider>
    </ApolloProvider>
  );

  onPageLoad(() => {
    ReactDOM.hydrate(<Main />, document.getElementById('react-app'));
  });
});
