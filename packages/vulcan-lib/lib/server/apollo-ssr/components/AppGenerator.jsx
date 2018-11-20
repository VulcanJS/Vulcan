/**
 * The App + relevant wrappers
 */
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { StaticRouter } from 'react-router';

// TODO:
// Problem: Components is only created on Startup
// so Components.App is not defined here
import { Components } from 'meteor/vulcan:lib'

// The client-side App will instead use <BrowserRouter>
// see client-side vulcan:core/lib/client/start.jsx implementation
// we do the same server side
const AppGenerator = ({ req, client, context }) => {
  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Components.App/>
      </StaticRouter>
    </ApolloProvider>
  );
  return App;
};
export default AppGenerator;
