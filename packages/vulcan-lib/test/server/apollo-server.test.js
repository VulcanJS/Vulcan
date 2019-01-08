import {
  createApolloServer,
  setupWebApp,
  defaultConfig,
  initGraphQL
} from '../../lib/server/apollo-server';
import {GraphQLSchema} from '../../lib/modules/graphql';
import expect from 'expect';

const test = it; // TODO: just before we switch to jest
describe('apollo-server', function() {
    let options;
    before(function () {
        initGraphQL();

        options = {
            config: defaultConfig,
            // Apollo options
            apolloServerOptions: {
                schema: GraphQLSchema.getExecutableSchema(),
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
    describe('setupWebApp', function () { });
});
