/**
 * @see https://www.apollographql.com/docs/apollo-server/whats-new.html
 * @see https://www.apollographql.com/docs/apollo-server/migration-two-dot.html
 */

// Meteor WebApp use a Connect server, so we need to
// use apollo-server-express integration
//import express from 'express';
import {ApolloServer} from 'apollo-server-express';

import {Meteor} from 'meteor/meteor';

import {WebApp} from 'meteor/webapp';
import bodyParser from 'body-parser';

// import cookiesMiddleware from 'universal-cookie-express';
// import Cookies from 'universal-cookie';
import voyagerMiddleware from 'graphql-voyager/middleware/express';
import getVoyagerConfig from './voyager';
import {graphiqlMiddleware, getGraphiqlConfig} from './graphiql';
import getPlaygroundConfig from './playground';

import initGraphQL from './initGraphQL';
import './settings';
import {engineConfig} from './engine';
import {initContext, computeContextFromReq} from './context.js';

import {GraphQLSchema} from '../../modules/graphql.js';

import {enableSSR} from '../apollo-ssr';

import universalCookiesMiddleware from 'universal-cookie-express';

import {
  getApolloApplyMiddlewareOptions,
  getApolloServerOptions,
} from './settings';

import {getSetting} from '../../modules/settings.js';
import {formatError} from 'apollo-errors';

//import _merge from 'lodash/merge';
/**
 * Options: Apollo server usual options
 *
 * Config: a config specific to Vulcan
 */
const createApolloServer = ({
  apolloServerOptions = {}, // apollo options
  config = {}, // Vulcan options
  apolloApplyMiddlewareOptions, // apollo.applyMiddleware,
}) => {
  const initialContext = initContext(apolloServerOptions.context);

  // this replace the previous syntax graphqlExpress(async req => { ... })
  // this function takes the context, which contains the current request,
  // and setup the options accordingly ({req}) => { ...; return options }
  const contextFromReq = computeContextFromReq(
    initialContext,
    config.customContextFromReq
  );

  // given options contains the schema
  const apolloServer = new ApolloServer({
    engine: engineConfig,
    // graphql playground (replacement to graphiql), available on the app path
    playground: getPlaygroundConfig(config),
    // context optionbject or a function of the current request (+ maybe some other params)
    context: ({req}) => contextFromReq(req),
    debug: Meteor.isDevelopment,
    ...apolloServerOptions,
  });

  // default function does nothing
  config.configServer(apolloServer);

  // WebApp.connectHandlers is a connect server
  // you can add middlware as usual when using Express/Connect

  // parse cookies and assign req.universalCookies object
  WebApp.connectHandlers.use(universalCookiesMiddleware());

  // parse request
  WebApp.connectHandlers.use(
    bodyParser.json({limit: getSetting('apolloServer.jsonParserOptions.limit')})
  );
  WebApp.connectHandlers.use(
    config.path,
    bodyParser.text({type: 'application/graphql'})
  );

  // Provide the Meteor WebApp Connect server instance to Apollo
  // Apollo will use it instead of its own HTTP server
  apolloServer.applyMiddleware({
    // @see https://github.com/meteor/meteor/blob/master/packages/webapp/webapp_server.js
    app: WebApp.connectHandlers,
    path: config.path,
    // @see https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#Parameters-2
    ...apolloApplyMiddlewareOptions,
  });

  // setup the end point
  WebApp.connectHandlers.use(config.path, (req, res) => {
    if (req.method === 'GET') {
      res.end();
    }
  });

  /* Syntax for adding middlewares to /graphql
     Uses Connect + Meteor + Apollo
     For the list of already set middlewares (cookies, compression...), see:
    @see https://github.com/meteor/meteor/blob/master/packages/webapp/webapp_server.js

    It is the easiest pattern and should be used as a default

    WebApp.connectHandlers.use(yourMiddleware)
  */
  if (Meteor.isDevelopment) {
    // Voyager is a GraphQL schema visual explorer
    // available on /voyager as a default
    WebApp.connectHandlers.use(
      config.voyagerPath,
      voyagerMiddleware(getVoyagerConfig(config))
    );
    // Setup GraphiQL
    WebApp.connectHandlers.use(
      config.graphiqlPath,
      graphiqlMiddleware(getGraphiqlConfig(config))
    );
  }

  // ssr
  enableSSR({computeContext: contextFromReq});

  /*
   * Alternative syntax with Express instead of Connect
   * Use only if the default server created by WebApp is
   * not sufficient
   *
   * const app = express()
   * app.use(...)
   *
   * WebApp.connectHandlers.use(app)
   * or
   * WebApp.connectHandlers.use(config.path, app)
   */

  // TODO: previous implementation used a patch. Is it still needed?
  //webAppConnectHandlersUse(Meteor.bindEnvironment(apolloServer), {
  //  name: 'graphQLServerMiddleware_bindEnvironment',
  //  order: 30
  //});
};

// createApolloServer when server startup
Meteor.startup(() => {
  initGraphQL(); // define executableSchema
  createApolloServer({
    config: {
      path: '/graphql',
      maxAccountsCacheSizeInMB: 1,
      configServer: apolloServer => {},
      voyagerPath: '/graphql-voyager',
      graphiqlPath: '/graphiql',
      // customConfigFromReq
    },
    apolloServerOptions: {
      schema: GraphQLSchema.executableSchema,
      formatError,
      tracing: getSetting('apolloTracing', Meteor.isDevelopment),
      cacheControl: true,
      ...getApolloServerOptions(),
    },
    apolloApplyMiddlewareOptions: {
      bodyParser: false, // added manually later
      ...getApolloApplyMiddlewareOptions(),
    },
    // config: ....
    // contextFromReq: ....
  });
});
