import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import deepmerge from 'deepmerge';
import OpticsAgent from 'optics-agent'
import DataLoader from 'dataloader';

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

import { GraphQLSchema, Utils } from '../modules/index.js';
import { webAppConnectHandlersUse } from './meteor_patch.js';

import { Collections } from '../modules/collections.js';
import findByIds from '../modules/findbyids.js';

// defaults
const defaultConfig = {
  path: '/graphql',
  maxAccountsCacheSizeInMB: 1,
  graphiql: Meteor.isDevelopment,
  graphiqlPath: '/graphiql',
  graphiqlOptions: {
    passHeader: "'Authorization': localStorage['Meteor.loginToken']", // eslint-disable-line quotes
  },
  configServer: (graphQLServer) => {},
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

  // Use Optics middleware
  if (process.env.OPTICS_API_KEY) {
    graphQLServer.use(OpticsAgent.middleware());
  }

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

    // Add Optics to GraphQL context object
    if (process.env.OPTICS_API_KEY) {
      options.context.opticsContext = OpticsAgent.context(req);
    }

    // Get the token from the header
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      check(token, String);
      const hashedToken = Accounts._hashLoginToken(token);

      // Get the user from the database
      user = await Meteor.users.findOne(
        { 'services.resume.loginTokens.hashedToken': hashedToken },
      );

      if (user) {
        const loginToken = Utils.findWhere(user.services.resume.loginTokens, { hashedToken });
        const expiresAt = Accounts._tokenExpiration(loginToken.when);
        const isExpired = expiresAt < new Date();

        if (!isExpired) {
          options.context.userId = user._id;
          options.context.currentUser = user;
        }
      }
    }

    // merge with custom context
    options.context = deepmerge(options.context, GraphQLSchema.context);

    // go over context and add Dataloader to each collection
    Collections.forEach(collection => {
      options.context[collection.options.collectionName].loader = new DataLoader(ids => findByIds(collection, ids, options.context), { cache: true });
    });

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

  // typeDefs
  const generateTypeDefs = () => [`
    scalar JSON
    scalar Date

    ${GraphQLSchema.getCollectionsSchemas()}
    ${GraphQLSchema.getAdditionalSchemas()}

    type Query {
      ${GraphQLSchema.queries.join('\n')}
    }

    ${GraphQLSchema.mutations.length > 0 ? `
    type Mutation {
      ${GraphQLSchema.mutations.join('\n')}
    }
    ` : ''}
  `];

  const typeDefs = generateTypeDefs();

  GraphQLSchema.finalSchema = typeDefs;

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: GraphQLSchema.resolvers,
  });

  if (process.env.OPTICS_API_KEY) {
    OpticsAgent.instrumentSchema(schema)
  }

  createApolloServer({
    schema,
  });
});
