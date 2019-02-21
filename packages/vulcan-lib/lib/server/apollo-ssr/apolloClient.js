/*
 * This client is used to prefetch data server side
 * (necessary for SSR)
 *
 * /!\ It must be recreated on every request
 */

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { SchemaLink } from 'apollo-link-schema';
import { GraphQLSchema } from '../../modules/graphql.js';

import { createStateLink } from '../../modules/apollo-common';
import { ApolloLink } from 'apollo-link';

// @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#local-queries
// import { createHttpLink } from 'apollo-link-http';
// import fetch from 'node-fetch'

export const createClient = async ({ req, computeContext }) => {
  // init
  // stateLink will init the client internal state
  const cache = new InMemoryCache();
  const stateLink = createStateLink({ cache });
  // schemaLink will fetch data directly based on the executable schema
  const schema = GraphQLSchema.getExecutableSchema();
  // this is the resolver context
  const context = await computeContext(req);
  const schemaLink = new SchemaLink({ schema, context });
  const client = new ApolloClient({
    ssrMode: true,
    link: ApolloLink.from([stateLink, schemaLink]),
    // @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#local-queries
    // Remember that this is the interface the SSR server will use to connect to the
    // API server, so we need to ensure it isn't firewalled, etc
    //link: createHttpLink({
    //    uri: 'http://localhost:3000',
    //    credentials: 'same-origin',
    //    headers: {
    //        // NOTE: this is a Connect req, not an Express req,
    //        // so req.header is not defined
    //        // cookie: req.header('Cookie'),
    //        cookie: req.headers['cookie'],
    //    },
    //    // need to explicitely pass fetch server side
    //    fetch
    //}),
    cache,
  });
  return client;
};
