/**
 * The App + relevant wrappers
 */
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { runCallbacks } from '../../modules';

import { Components } from 'meteor/vulcan:lib';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';

const AppGenerator = ({ apolloClient }) => {
  const App = (
    <ApolloProvider client={apolloClient}>
        <CookiesProvider>
            <BrowserRouter>
                <Components.App />
            </BrowserRouter>
        </CookiesProvider>
    </ApolloProvider>
  );
  // run user registered callbacks to wrap the app
  const WrappedApp = runCallbacks({
    name: 'router.client.wrapper', 
    iterator: App, 
    properties: { apolloClient }
  });
  return WrappedApp;
};
export default AppGenerator;