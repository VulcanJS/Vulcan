import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { onPageLoad } from 'meteor/server-render';
import { ApolloProvider } from 'react-apollo';

import {
  apolloClient,
  Components,
  addRoute,
  populateComponentsApp,
  populateRoutesApp,
  initializeFragments,
} from 'meteor/vulcan:lib';

Meteor.startup(() => {

  // define 404 route
  // addRoute({ name: 'app.notfound', componentName: 'Error404' });

  // init the application components and routes, including components & routes from 3rd-party packages
  initializeFragments();
  populateComponentsApp();
  populateRoutesApp();

  const rootElementName = 'react-app';
  const rootElementType = 'div';
  // In case the root element doesn't exist, let's create it
  const rootElement = document.createElement(rootElementType);
  rootElement.id = rootElementName;
  document.body.appendChild(rootElement);

  const Main = () => (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <Components.App />
      </BrowserRouter>
    </ApolloProvider>
  );

  onPageLoad(() => {
    ReactDOM.hydrate(<Main />, document.getElementById('react-app'));
  });
});
