/**
 * @see https://www.apollographql.com/docs/apollo-server/whats-new.html
 * @see https://www.apollographql.com/docs/apollo-server/migration-two-dot.html
 */

// Meteor WebApp use a Connect server, so we need to
// use apollo-server-express integration
// We also add Express to WebApp in order to use any kind of middlewares
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { Meteor } from 'meteor/meteor';

import { WebApp } from 'meteor/webapp';
import _get from 'lodash/get';
import { bodyParserGraphQL } from 'body-parser-graphql';

// import cookiesMiddleware from 'universal-cookie-express';
// import Cookies from 'universal-cookie';
import voyagerMiddleware from 'graphql-voyager/middleware/express';
import getVoyagerConfig from './voyager';
import { graphiqlMiddleware, getGraphiqlConfig } from './graphiql';
import getPlaygroundConfig from './playground';

import initGraphQL from './initGraphQL';
import './settings';
import { engineConfig } from './engine';
import { initContext, computeContextFromReq } from './context.js';

import { GraphQLSchema } from '../graphql/index.js';

import { enableSSR } from '../apollo-ssr';

import universalCookiesMiddleware from 'universal-cookie-express';

import { getApolloApplyMiddlewareOptions, getApolloServerOptions } from './settings';

import { getSetting } from '../../modules/settings.js';
import { formatError } from 'apollo-errors';
import { runCallbacks } from '../../modules/callbacks';

export const setupGraphQLMiddlewares = async (apolloServer, config, apolloApplyMiddlewareOptions) => {
  // IMPORTANT: order matters !
  // 1 - Add request parsing middleware
  // 2 - Add apollo specific middlewares
  // 3 - CLOSE CONNEXION (otherwise the endpoint hungs)
  // 4 - ONLY THEN you can start adding other middlewares (graphql voyager etc.)

  // WebApp.connectHandlers is a connect server
  // you can add middlware as usual when using Express/Connect
  // Use the Express app instead of just Node connect (allow better middleware chaining)
  const app = express();
  // parse cookies and assign req.universalCookies object
  app.use(universalCookiesMiddleware());
  // parse request (order matters)

  app.use(
    config.path,
    // won't handle graphql
    //bodyParser.json({ limit: getSetting('apolloServer.jsonParserOptions.limit') })
    bodyParserGraphQL({ limit: getSetting('apolloServer.jsonParserOptions.limit') })
  );

  //WebApp.connectHandlers.use(config.path, bodyParser.text({ type: 'application/graphql' }));
  WebApp.connectHandlers.use(app);

  // enhance webapp
  runCallbacks({
    name: 'graphql.middlewares.setup',
    iterator: WebApp,
    properties: {},
  });

  await apolloServer.start();

  // Provide the Meteor WebApp Connect server instance to Apollo
  // Apollo will use it instead of its own HTTP server when handling requests

  //   For the list of already set middlewares (cookies, compression...), see:
  //  @see https://github.com/meteor/meteor/blob/master/packages/webapp/webapp_server.js
  apolloServer.applyMiddleware({
    ...apolloApplyMiddlewareOptions,
  });

  // setup the end point otherwise the request hangs
  // TODO: undestand why this is necessary
  // @see
  WebApp.connectHandlers.use(config.path, (req, res) => {
    if (req.method === 'GET') {
      res.end();
    }
  });
};

export const setupToolsMiddlewares = config => {
  // Voyager is a GraphQL schema visual explorer
  // available on /voyager as a default
  WebApp.connectHandlers.use(config.voyagerPath, voyagerMiddleware(getVoyagerConfig(config)));
  // Setup GraphiQL
  WebApp.connectHandlers.use(config.graphiqlPath, graphiqlMiddleware(getGraphiqlConfig(config)));
};

/**
 *  setup CORS
 *  @see https://expressjs.com/en/resources/middleware/cors.html
 *  @see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserver
 *  In Apollo, default cors is defined in packages/apollo-server/src/index.ts, it's too permissive so we use "false" in production
 */
const getCorsOptions = () => {
  // enable all cors
  const enableAllcors = _get(Meteor.settings, 'apolloServer.corsEnableAll', false);
  if (enableAllcors) return true; // will allow all distant queries DANGEROUS
  // enable only a whitelist or nothing
  const corsWhitelist = _get(Meteor.settings, 'apolloServer.corsWhitelist', []);
  const corsOptions =
    corsWhitelist && corsWhitelist.length
      ? {
          origin: function(origin, callback) {
            if (!origin) {
              callback(null, true); // same origin
            } else if (corsWhitelist.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
          },
          credentials: true,
        }
      : process.env.NODE_ENV === 'development'; // default behaviour is activating all in dev, deactivating all in production
  return corsOptions;
};

/**
 * Options: Apollo server usual options
 * Config: a config specific to Vulcan
 */
export const createApolloServer = ({
  apolloServerOptions = {}, // apollo options
  config, // Vulcan options
}) => {
  // given options contains the schema
  const apolloServer = new ApolloServer({
    // graphql playground (replacement to graphiql), available on the app path
    playground: getPlaygroundConfig(config),
    // context optionbject or a function of the current request (+ maybe some other params)
    debug: Meteor.isDevelopment,
    cache: 'bounded',
    ...apolloServerOptions,
  });

  // default function does nothing
  if (config.configServer) {
    config.configServer(apolloServer);
  }

  return apolloServer;
};

export const onStart = () => {
  // Vulcan specific options
  const config = {
    path: '/graphql',
    maxAccountsCacheSizeInMB: 1,
    configServer: apolloServer => {},
    voyagerPath: '/graphql-voyager',
    graphiqlPath: '/graphiql',
    // customConfigFromReq
  };
  const corsOptions = getCorsOptions();
  const apolloApplyMiddlewareOptions = {
    // @see https://github.com/meteor/meteor/blob/master/packages/webapp/webapp_server.js
    // @see https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#Parameters-2
    bodyParser: false, // added manually later
    path: config.path,
    app: WebApp.connectHandlers,
    cors: corsOptions,
    ...getApolloApplyMiddlewareOptions(),
  };
  // init context
  const initialContext = initContext();
  // this replace the previous syntax graphqlExpress(async req => { ... })
  // this function takes the context, which contains the current request,
  // and setup the options accordingly ({req}) => { ...; return options }
  const context = computeContextFromReq(initialContext);

  // define executableSchema
  initGraphQL();

  // create server
  const apolloServer = createApolloServer({
    config,
    apolloServerOptions: {
      engine: engineConfig,
      schema: GraphQLSchema.executableSchema,
      formatError,
      tracing: getSetting('apolloTracing', Meteor.isDevelopment),
      cacheControl: {
        defaultMaxAge: 1000,
      },
      context: ({ req }) => context(req),
      ...getApolloServerOptions(),
    },
  });
  // NOTE: order matters here
  // /graphql middlewares (request parsing)
  setupGraphQLMiddlewares(apolloServer, config, apolloApplyMiddlewareOptions);
  //// other middlewares (dev tools etc.)
  if (Meteor.isDevelopment) {
    setupToolsMiddlewares(config);
  }
  // ssr
  const disableSSR = getSetting('apolloSsr.disable', false);
  if (!disableSSR) {
    enableSSR({ computeContext: context });
  }
  return apolloServer;
};
