/**
 * @see https://www.apollographql.com/docs/apollo-server/whats-new.html
 * @see https://www.apollographql.com/docs/apollo-server/migration-two-dot.html
 */

import { makeExecutableSchema } from 'apollo-server';
// Meteor WebApp use a Connect server, so we need to
// use apollo-server-express integration
import { ApolloServer } from 'apollo-server-express';

import { Meteor } from 'meteor/meteor';

import { GraphQLSchema } from '../../modules/graphql.js';
import { WebApp } from 'meteor/webapp';

import { runCallbacks } from '../../modules/callbacks.js';
// import cookiesMiddleware from 'universal-cookie-express';
// import Cookies from 'universal-cookie';
import { express as voyagerMiddleware } from 'graphql-voyager';
import getVoyagerConfig from './voyager';

export let executableSchema;

import './settings';
import { engineConfig } from './engine';
import { defaultConfig, defaultOptions } from './defaults';
import { initContext, computeContextFromReq } from './context.js';
import getPlaygroundConfig from './playground';

/**
 * Options: Apollo server usual options
 *
 * Config: a config specific to Vulcan
 */
const createApolloServer = ({ options: givenOptions = {}, config: givenConfig = {}, contextFromReq }) => {
  const graphiqlOptions = { ...defaultConfig.graphiqlOptions, ...givenConfig.graphiqlOptions };
  const config = { ...defaultConfig, ...givenConfig };
  config.graphiqlOptions = graphiqlOptions;

  // get the options and merge in defaults
  const options = { ...defaultOptions, ...givenOptions };
  const context = initContext(options.context);
  // given options contains the schema
  const apolloServer = new ApolloServer({
    engine: engineConfig,
    // graphql playground (replacement to graphiql), available on the app path
    playground: getPlaygroundConfig(config),
    ...options,
    // this replace the previous syntax graphqlExpress(async req => { ... })
    // this function takes the context, which contains the current request,
    // and setup the options accordingly ({req}) => { ...; return options }
    context: computeContextFromReq(context, contextFromReq)
  });

  // default function does nothing
  config.configServer(apolloServer);

  // Provide the Meteor WebApp Connect server instance to Apollo
  // Apollo will use it instead of its own HTTP server
  apolloServer.applyMiddleware({
    // @see https://github.com/meteor/meteor/blob/master/packages/webapp/webapp_server.js
    app: WebApp.connectHandlers,
    path: config.path
  });

  // WebApp.connectHandlers is a connect server and exposes the same API
  // you can add middlware as usual
  // setup the end point
  WebApp.connectHandlers.use(config.path, (req, res) => {
    if (req.method === 'GET') {
      res.end();
    }
  });
  // Add your own middlewares
  // For the list of already set middlewares (cookies, compression...), see:
  // @see https://github.com/meteor/meteor/blob/master/packages/webapp/webapp_server.js
  // TODO: not sure if "config.path" is necessary
  //WebApp.connectHandlers.use(config.path, /* your middleware */);
  // Voyager is a schema visualizer
  WebApp.connectHandlers.use(config.voyagerPath, voyagerMiddleware(getVoyagerConfig(config)));

  /*
  * Alternative syntax with Express.
  * WebApp will use Connect as a default.
  * Use if Express is needed in addition to connect.  
  * 
  * const app = express()
  * app.use(...)
  *
  * WebApp.connectHandlers.use(app) 
  * 
  */

  // TODO: previous implementation used a patch. Is it still needed?
  //webAppConnectHandlersUse(Meteor.bindEnvironment(apolloServer), {
  //  name: 'graphQLServerMiddleware_bindEnvironment',
  //  order: 30
  //});
};

// createApolloServer when server startup
Meteor.startup(() => {
  runCallbacks('graphql.init.before');

  // typeDefs
  const generateTypeDefs = () => [
    `
scalar JSON
scalar Date

${GraphQLSchema.getAdditionalSchemas()}

${GraphQLSchema.getCollectionsSchemas()}

type Query {

${GraphQLSchema.queries
      .map(
        q =>
          `${
            q.description
              ? `  # ${q.description}
`
              : ''
          }  ${q.query}
  `
      )
      .join('\n')}
}

${
      GraphQLSchema.mutations.length > 0
        ? `type Mutation {

${GraphQLSchema.mutations
            .map(
              m =>
                `${
                  m.description
                    ? `  # ${m.description}
`
                    : ''
                }  ${m.mutation}
`
            )
            .join('\n')}
}
`
        : ''
    }
`
  ];

  const typeDefs = generateTypeDefs();

  GraphQLSchema.finalSchema = typeDefs;

  executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
    schemaDirectives: GraphQLSchema.directives
  });

  createApolloServer({
    options: {
      schema: executableSchema
    }
    // config: ....
    // contextFromReq: ....
  });
});
