import {
  createApolloServer,
  setupWebApp,
  defaultConfig,
  initGraphQL,
  initContext,
  computeContextFromReq,
} from '../../lib/server/apollo-server';
import {GraphQLSchema} from '../../lib/modules/graphql';
import expect from 'expect';
import {executableSchema} from './fixtures/minimalSchema';

const test = it; // TODO: just before we switch to jest
// @see https://www.apollographql.com/docs/apollo-server/features/testing.html

describe('apollo-server', function() {
  let options;
  before(function() {
    initGraphQL();

    options = {
      config: defaultConfig,
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
  describe('setupWebApp', function() {});
  describe('compute context', function() {
    test.skip('inital context contains data loaders', function() {
      // TODO
    });
    test.skip('initial context contains graphQLSchema context', function() {
      // TODO
    });
    test.skip('initial context is merged with provided context', function() {
      // TODO
    });
  });
});
