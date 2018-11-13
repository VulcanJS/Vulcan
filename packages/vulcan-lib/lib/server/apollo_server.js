import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import deepmerge from 'deepmerge';
import DataLoader from 'dataloader';
import { formatError } from 'apollo-errors';
import compression from 'compression';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
// import { Accounts } from 'meteor/accounts-base';
import { Engine } from 'apollo-engine';

import { GraphQLSchema } from '../modules/graphql.js';
import { Utils } from '../modules/utils.js';
import { webAppConnectHandlersUse } from './meteor_patch.js';

import { getSetting, registerSetting } from '../modules/settings.js';
import { Collections } from '../modules/collections.js';
import findByIds from '../modules/findbyids.js';
import { runCallbacks } from '../modules/callbacks.js';
import cookiesMiddleware from 'universal-cookie-express';
// import Cookies from 'universal-cookie';
import { _hashLoginToken, _tokenExpiration } from './accounts_helpers';
import { getHeaderLocale } from './intl.js';

export let executableSchema;

registerSetting('apolloEngine.logLevel', 'INFO', 'Log level (one of INFO, DEBUG, WARN, ERROR');
registerSetting('apolloServer.tracing', Meteor.isDevelopment, 'Tracing by Apollo. Default is true on development and false on prod', true);

// see https://github.com/apollographql/apollo-cache-control
const engineApiKey = getSetting('apolloEngine.apiKey');
const engineLogLevel = getSetting('apolloEngine.logLevel', 'INFO')
const engineConfig = {
  apiKey: engineApiKey,
  // "origins": [
  //   {
  //     "http": {
  //       "url": "http://localhost:3000/graphql"
  //     }
  //   }
  // ],
  'stores': [
    {
      'name': 'vulcanCache',
      'inMemory': {
        'cacheSize': 20000000
      }
    }
  ],
  // "sessionAuth": {
  //   "store": "embeddedCache",
  //   "header": "Authorization"
  // },
  // "frontends": [
  //   {
  //     "host": "127.0.0.1",
  //     "port": 3000,
  //     "endpoint": "/graphql",
  //     "extensions": {
  //       "strip": []
  //     }
  //   }
  // ],
  'queryCache': {
    'publicFullQueryStore': 'vulcanCache',
    'privateFullQueryStore': 'vulcanCache'
  },
  // "reporting": {
  //   "endpointUrl": "https://engine-report.apollographql.com",
  //   "debugReports": true
  // },
  'logging': {
    'level': engineLogLevel
  }
};
let engine;
if (engineApiKey) {
  engine = new Engine({ engineConfig });
  engine.start();
}

// defaults
const defaultConfig = {
  path: '/graphql',
  maxAccountsCacheSizeInMB: 1,
  graphiql: Meteor.isDevelopment,
  graphiqlPath: '/graphiql',
  graphiqlOptions: {
    passHeader: "'Authorization': localStorage['Meteor.loginToken']", // eslint-disable-line quotes
  },
  configServer: (graphQLServer) => { },
};

const defaultOptions = {
  formatError: e => ({
    message: e.message,
    locations: e.locations,
    path: e.path,
  }),
};

if (Meteor.isDevelopment) {
  defaultOptions.debug = true;
}

// createApolloServer
const createApolloServer = (givenOptions = {}, givenConfig = {}) => {
  const graphiqlOptions = { ...defaultConfig.graphiqlOptions, ...givenConfig.graphiqlOptions };
  const config = { ...defaultConfig, ...givenConfig };
  config.graphiqlOptions = graphiqlOptions;

  const graphQLServer = express();

  config.configServer(graphQLServer);

  // Use Engine middleware
  if (engineApiKey) {
    graphQLServer.use(engine.expressMiddleware());
  }

  // cookies
  graphQLServer.use(cookiesMiddleware());
  
  // compression
  graphQLServer.use(compression());

  // GraphQL endpoint
  graphQLServer.use(config.path, bodyParser.json(), graphqlExpress(async (req) => {
    let options;
    let user = null;

    if (typeof givenOptions === 'function') {
      options = givenOptions(req);
    } else {
      options = givenOptions;
    }

    // Merge in the defaults
    options = { ...defaultOptions, ...options };
    if (options.context) {
      // don't mutate the context provided in options
      options.context = { ...options.context };
    } else {
      options.context = {};
    }

    // enable tracing and caching
    options.tracing = getSetting('apolloServer.tracing', Meteor.isDevelopment);
    options.cacheControl = true;

    // note: custom default resolver doesn't currently work
    // see https://github.com/apollographql/apollo-server/issues/716
    // options.fieldResolver = (source, args, context, info) => {
    //   return source[info.fieldName];
    // }

    // console.log('// apollo_server.js req.renderContext');
    // console.log(req.renderContext);
    // console.log('\n\n');
    
    // Get the token from the header
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      check(token, String);
      const hashedToken = _hashLoginToken(token);

      // Get the user from the database
      user = await Meteor.users.findOne(
        { 'services.resume.loginTokens.hashedToken': hashedToken },
      );

      if (user) {

        // identify user to any server-side analytics providers
        runCallbacks('events.identify', user);

        const loginToken = Utils.findWhere(user.services.resume.loginTokens, { hashedToken });
        const expiresAt = _tokenExpiration(loginToken.when);
        const isExpired = expiresAt < new Date();

        if (!isExpired) {
          options.context.userId = user._id;
          options.context.currentUser = user;
        }
      }
    }
    
    //add the headers to the context
    options.context.headers = req.headers;


    // merge with custom context
    options.context = deepmerge(options.context, GraphQLSchema.context);

    // go over context and add Dataloader to each collection
    Collections.forEach(collection => {
      options.context[collection.options.collectionName].loader = new DataLoader(ids => findByIds(collection, ids, options.context), { cache: true });
    });

    // look for headers either in renderContext (SSR) or req (normal request to the endpoint)
    const headers = req.renderContext.originalHeaders || req.headers;

    options.context.locale = getHeaderLocale(headers, user && user.locale);
    
    // console.log('// apollo_server.js isSSR?', !!req.renderContext.originalHeaders ? 'yes' : 'no');
    // console.log('// apollo_server.js headers:');
    // console.log(headers);
    // console.log('// apollo_server.js final locale: ', options.context.locale);
    // console.log('\n\n');

    // add error formatting from apollo-errors
    options.formatError = formatError;

    return options;
  }));

  // Start GraphiQL if enabled
  if (config.graphiql) {
    graphQLServer.use(config.graphiqlPath, graphiqlExpress({ ...config.graphiqlOptions, endpointURL: config.path }));
  }

  // This binds the specified paths to the Express server running Apollo + GraphiQL
  webAppConnectHandlersUse(Meteor.bindEnvironment(graphQLServer), {
    name: 'graphQLServerMiddleware_bindEnvironment',
    order: 30,
  });
};

// createApolloServer when server startup
Meteor.startup(() => {

  runCallbacks('graphql.init.before');

  // typeDefs
  const generateTypeDefs = () => [`
scalar JSON
scalar Date

${GraphQLSchema.getAdditionalSchemas()}

${GraphQLSchema.getCollectionsSchemas()}

type Query {

${GraphQLSchema.queries.map(q => (
    `${q.description ? `  # ${q.description}
` : ''}  ${q.query}
  `)).join('\n')}
}

${GraphQLSchema.mutations.length > 0 ? `type Mutation {

${GraphQLSchema.mutations.map(m => (
`${m.description ? `  # ${m.description}
` : ''}  ${m.mutation}
`)).join('\n')}
}
` : ''}
`];

  const typeDefs = generateTypeDefs();

  GraphQLSchema.finalSchema = typeDefs;

  executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
    schemaDirectives: GraphQLSchema.directives,
  });

  createApolloServer({
    schema: executableSchema,
  });
});
