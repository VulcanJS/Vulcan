/**
 * The App + relevant wrappers
 */
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { StaticRouter } from 'react-router';
import { runCallbacks } from '../../../modules'

// TODO:
// Problem: Components is only created on Startup
// so Components.App is not defined here
import { Components } from 'meteor/vulcan:lib'

import { CookiesProvider } from 'react-cookie';

import Cookies from 'universal-cookie';
// The client-side App will instead use <BrowserRouter>
// see client-side vulcan:core/lib/client/start.jsx implementation
// we do the same server side
const AppGenerator = ({ req, apolloClient, context }) => {
  // TODO: universalCookies should be defined here, but it isn't
  // @see https://github.com/meteor/meteor-feature-requests/issues/174#issuecomment-441047495
  const cookies = new Cookies(req.cookies) // req.universalCookies;
  const App = (
    <ApolloProvider client={apolloClient}>
      <StaticRouter location={req.url} context={context}>
        <CookiesProvider cookies={cookies}>
          <Components.App />
        </CookiesProvider>
      </StaticRouter>
    </ApolloProvider>
  );
  // run user registered callbacks
  const WrappedApp = runCallbacks({
    name: 'router.server.wrapper', 
    iterator: App, 
    properties: { req, context, apolloClient }
  });
  return WrappedApp;
};
export default AppGenerator;
