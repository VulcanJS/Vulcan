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

// import cookiesMiddleware from 'universal-cookie-express';
// import Cookies from 'universal-cookie';
import voyagerMiddleware from 'graphql-voyager/middleware/express';
import getVoyagerConfig from './voyager';
import {graphiqlMiddleware, getGraphiqlConfig} from './graphiql';
import getPlaygroundConfig from './playground';

import initGraphQL from './initGraphQL';
import './settings';
import {engineConfig} from './engine';
import {defaultConfig, defaultOptions} from './defaults';
import {initContext, computeContextFromReq} from './context.js';

import {GraphQLSchema} from '../../modules/graphql.js';

import {enableSSR} from '../apollo-ssr';

import universalCookiesMiddleware from 'universal-cookie-express';
/**
 * Options: Apollo server usual options
 *
 * Config: a config specific to Vulcan
 */
const createApolloServer = ({
  options: givenOptions = {},
  config: givenConfig = {},
  customContextFromReq,
}) => {
  const graphiqlOptions = {
    ...defaultConfig.graphiqlOptions,
    ...givenConfig.graphiqlOptions,
  };
  const config = {...defaultConfig, ...givenConfig};
  config.graphiqlOptions = graphiqlOptions;

  // get the options and merge in defaults
  const options = {...defaultOptions, ...givenOptions};
  const initialContext = initContext(options.context);

  // this replace the previous syntax graphqlExpress(async req => { ... })
  // this function takes the context, which contains the current request,
  // and setup the options accordingly ({req}) => { ...; return options }
  const contextFromReq = computeContextFromReq(
    initialContext,
    customContextFromReq
  );
  // given options contains the schema
  const apolloServer = new ApolloServer({
    engine: engineConfig,
    // graphql playground (replacement to graphiql), available on the app path
    playground: getPlaygroundConfig(config),
    ...options,
    // context optionbject or a function of the current request (+ maybe some other params)
    context: ({req}) => contextFromReq(req),
  });

  // default function does nothing
  config.configServer(apolloServer);

  // WebApp.connectHandlers is a connect server
  // you can add middlware as usual when using Express/Connect

  // parse cookies and assign req.universalCookies object
  WebApp.connectHandlers.use(universalCookiesMiddleware());

  // Provide the Meteor WebApp Connect server instance to Apollo
  // Apollo will use it instead of its own HTTP server
  apolloServer.applyMiddleware({
    // @see https://github.com/meteor/meteor/blob/master/packages/webapp/webapp_server.js
    app: WebApp.connectHandlers,
    path: config.path,
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
    options: {
      schema: GraphQLSchema.executableSchema,
    },
    // config: ....
    // contextFromReq: ....
  });
});
