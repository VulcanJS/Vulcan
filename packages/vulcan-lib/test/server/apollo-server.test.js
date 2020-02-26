import { createApolloServer, onStart } from '../../lib/server/apollo-server/apollo_server';
//import initGraphQL from '../../lib/server/apollo-server/initGraphQL';
//import { GraphQLSchema } from '../../lib/modules/graphql';
import expect from 'expect';
import { executableSchema } from './fixtures/minimalSchema';
import { createTestClient } from 'apollo-server-testing'



const test = it; // TODO: just before we switch to jest
// @see https://www.apollographql.com/docs/apollo-server/features/testing.html

describe('apollo-server', function () {
  let options;
  before(function () {
    // TODO: does not work in this test. This should setup the schema.
    //   initGraphQL();

    options = {
      config: {}, //defaultConfig,
      // Apollo options
      apolloServerOptions: {
        // TODO: check why this fails. One of the schema defined
        // in one of the test file (when running createCollection in a test)
        // is not working as expected
        //schema: GraphQLSchema.getExecutableSchema(),
        schema: executableSchema,
        //formatError,
        //tracing: getSetting('apolloTracing', Meteor.isDevelopment),
        cacheControl: true,
        //context
      },
      // Apollo applyMiddleware Option
      apolloApplyMiddlewareOptions: {},
    };
  });
  describe('createServer', function () {
    test('init server', function () {
      const server = createApolloServer(options);
      expect(server).toBeDefined();
    });
  });

  describe('body parser', () => {
    test('application/graphql', () => {
      const server = onStart()
      const { query, /*mutate*/ } = createTestClient(server)
      const res = await query({
        query: ``,
        variables: {}
      })
      expect(res).toEqual({})
    })
  })

  describe('cors', () => {
    test('cors', async () => {
      const corsDisallowed
      const server = createApolloServer(options);
      const { query, mutate } = createTestClient(server)
      query({
        query: ``,
        variables: { id: 1 }
      })
      // mutate({mutation: ``, variables: {...}})
      const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
      expect(res).toEqual({})
    })
  })
  describe('bodyParser', () => {
    test('answer to application/graphql calls', () => {
      const server = createApolloServer(options);
      expect(server).toBeDefined();
    })

  })
  describe('setupWebApp', function () { });
  describe('compute context', function () {
    test.skip('initial context contains graphQLSchema context', function () {
      // TODO
    });
    test.skip('initial context is merged with provided context', function () {
      // TODO
    });
    test.skip('data loaders are regenerated on each request', function () {
      // TODO
    });
  });
});
