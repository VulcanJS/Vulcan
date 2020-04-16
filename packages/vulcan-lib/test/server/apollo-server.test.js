import { createApolloServer, onStart } from '../../lib/server/apollo-server/apollo_server';
//import initGraphQL from '../../lib/server/apollo-server/initGraphQL';
import { GraphQLSchema } from '../../lib/server/graphql';
import expect from 'expect';
import { executableSchema } from './fixtures/minimalSchema';
import { createTestClient } from 'apollo-server-testing';
// import { createTestClient } from 'apollo-server-testing'
import { WebApp } from 'meteor/webapp';
import request from 'supertest';

const test = it; // TODO: just before we switch to jest
// @see https://www.apollographql.com/docs/apollo-server/features/testing.html

describe('apollo-server', function() {
  let options;
  before(function() {
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
  describe('createServer', function() {
    test('init server', function() {
      const server = createApolloServer(options);
      expect(server).toBeDefined();
    });
  });

  describe('body parser', () => {
    test.skip('application/graphql', async () => {
      const server = onStart();
      const { query /*mutate*/ } = createTestClient(server);
      const res = await query({
        query: ``,
        variables: {},
      });
      expect(res).toEqual({});
    });
  });

  describe('cors', () => {
    test.skip('cors', async () => {
      //const corsDisallowed
      const server = createApolloServer(options);
      const { query, mutate } = createTestClient(server);
      query({
        query: ``,
        variables: { id: 1 },
      });
      // mutate({mutation: ``, variables: {...}})
      const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
      expect(res).toEqual({});
    });
    test.skip('cors works with same origin', () => {});
  });
  describe('bodyParser', () => {
    test.skip('answer to application/graphql calls', () => {
      const server = createApolloServer(options);
      expect(server).toBeDefined();
    });
  });
  describe('setupWebApp', function() {});
  describe('compute context', function() {
    test.skip('initial context contains graphQLSchema context', function() {
      before(() => {
        // reinit the graphql schema
        // NOTE: do NOT use initGraphQLTest => we only want to drop the graphql schema, as apolloServer will already reinit it during onStart call
        GraphQLSchema.init();
        // FIXME: the schema is not yet ready when tests are run
        // it makes the bodyParser tests failing at first run even if they are valid
        onStart();
      });

      // TODO: not yet working
      // also can't configure HTTP request to change headers
      //test('application/graphql', async () => {
      //  const server = onStart()
      //  const { query, /*mutate*/ } = createTestClient(server)
      //  const res = await query({
      //    query: `query currentUser {
      //      currentUser {
      //        _id
      //      }
      //    }`
      //  })
      //  expect(res).toEqual({})
      //})

      // Example HTTP integration test with usual supertest lib
      // FIXME: test is passing but only after a reload
      test.skip('application/graphql', async () => {
        const res = await request(WebApp.connectHandlers)
          .post('/graphql')
          .send(
            `
          query currentUser {
            currentUser {
              _id
            }
          }`
          )
          .set('Content-Type', 'application/graphql');
        const data = JSON.parse(res.text).data;
        expect(data).toEqual({ currentUser: null });
      });
      // FIXME: test is passing but only after a reload
      test.skip('application/json', async () => {
        const res = await request(WebApp.connectHandlers)
          .post('/graphql')
          .send(
            JSON.stringify({
              query: `
          query currentUser {
            currentUser {
              _id
            }
          }`,
            })
          )
          .set('Content-Type', 'application/json');
        //.expect('Content-Type', /json/)
        const data = JSON.parse(res.text).data;
        expect(data).toEqual({ currentUser: null });
      });
    });

    /*
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
  })*/
    describe('setupWebApp', function() {});
    describe('compute context', function() {
      test.skip('initial context contains graphQLSchema context', function() {
        // TODO
      });
      test.skip('initial context is merged with provided context', function() {
        // TODO
      });
      test.skip('data loaders are regenerated on each request', function() {
        // TODO
      });
    });
  });
});
