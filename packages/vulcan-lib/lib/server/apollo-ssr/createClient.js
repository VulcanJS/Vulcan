/*
 * This client is used to prefetch data server side
 * (necessary for SSR)
 * 
 * /!\ It must be recreated on every request
 */


import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import fetch from 'node-fetch'
import { InMemoryCache } from 'apollo-cache-inmemory';

// Alternative that does not send real HTTP queries
// @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#local-queries
// import { SchemaLink } from 'apollo-link-schema';
// import schema from "???"


const createClient = (req) => {
    const client = new ApolloClient({
        ssrMode: true,
        // Remember that this is the interface the SSR server will use to connect to the
        // API server, so we need to ensure it isn't firewalled, etc
        link: createHttpLink({
            uri: 'http://localhost:3000',
            credentials: 'same-origin',
            headers: {
                // NOTE: this is a Connect req, not an Express req,
                // so req.header is not defined
                // cookie: req.header('Cookie'),
                cookie: req.headers['cookie'],
            },
            // need to explicitely pass fetch server side
            fetch
        }),

        // Alternative that does not send real HTTP queries
        // link: new SchemaLink({ schema }),
        
        cache: new InMemoryCache(),
    });
    return client
}
export default createClient