import React from 'react'
import { ApolloProvider } from 'react-apollo';
import { StaticRouter } from 'react-router';

// TODO:
// Problem: Components is only created on Startup
// so Components.App is not defined here
//import { Components } from 'meteor/vulcan:lib'

// TODO: adapt to Vulcan
// The client-side App will instead use <BrowserRouter>
// see client-side vulcan:core/lib/client/start.jsx implementation
// we do the same server side
const appGenerator = ({req, client, context}) => (
    <ApolloProvider client={client}>
        <StaticRouter location={req.url} context={context}>
            <div>Hello world from apollo-ssr/App.jsx</div>
            {/*<Components.App/> */}
        </StaticRouter>
    </ApolloProvider>
);
export default appGenerator