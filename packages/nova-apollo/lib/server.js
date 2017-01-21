// note(oct. 28, 2016)
// by-pass the meteor integration to use the features of apollo-client 0.5.x / graphql-server 0.4.x

// -------
// start of main-client from apollostack/meteor-integration

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';

import deepmerge from 'deepmerge';

import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import Users from 'meteor/nova:users';

import { GraphQLSchema } from 'meteor/nova:lib';

import OpticsAgent from 'optics-agent'


const defaultConfig = {
  path: '/graphql',
  maxAccountsCacheSizeInMB: 1,
  graphiql : Meteor.isDevelopment,
  graphiqlPath : '/graphiql',
  graphiqlOptions : {
    passHeader : "'Authorization': localStorage['Meteor.loginToken']"
  },
  configServer: (graphQLServer) => {},
};

const defaultOptions = {
  formatError: e => ({
    message: e.message,
    locations: e.locations,
    path: e.path
  }),
  debug: Meteor.isDevelopment,
};

export const createApolloServer = (givenOptions = {}, givenConfig = {}) => {

  let graphiqlOptions = Object.assign({}, defaultConfig.graphiqlOptions, givenConfig.graphiqlOptions);
  let config = Object.assign({}, defaultConfig, givenConfig);
  config.graphiqlOptions = graphiqlOptions;

  const graphQLServer = express();

  config.configServer(graphQLServer)

  // Load the cookie parsing middleware, used to grab login token
  graphQLServer.use(cookieParser());
  
  // Use Optics middleware
  if (process.env.OPTICS_API_KEY) {
    graphQLServer.use(OpticsAgent.middleware());
  }
  
  // GraphQL endpoint
  graphQLServer.use(config.path, bodyParser.json(), graphqlExpress(async (req) => {
    let options,
        user = null;

    // console.log('Login token: ', req.cookies.meteor_login_token);

    if (_.isFunction(givenOptions))
      options = givenOptions(req);
    else
      options = givenOptions;

    // Merge in the defaults
    options = Object.assign({}, defaultOptions, options);

    if (options.context) {
      // don't mutate the context provided in options
      options.context = Object.assign({}, options.context);
    } else {
      options.context = {};
    }

    // Add Optics to GraphQL context object
    if (process.env.OPTICS_API_KEY) {
      options.context.opticsContext = OpticsAgent.context(req);
    }
  
    options.context.getViewableFields = Users.getViewableFields;
    
    // Get the token from the header
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      check(token, String);
      const hashedToken = Accounts._hashLoginToken(token);

      // Get the user from the database
      user = await Users.findOne(
        {"services.resume.loginTokens.hashedToken": hashedToken},
        // {fields: {
        //   _id: 1,
        //   'services.resume.loginTokens.$': 1
        // }}
        );

      if (user) {

        const expiresAt = Accounts._tokenExpiration(user.services.resume.loginTokens[0].when);
        const isExpired = expiresAt < new Date();

        if (!isExpired) {

          options.context.userId = user._id;
          options.context.currentUser = user;
        }
      }
    }
    
    options.context = deepmerge(options.context, GraphQLSchema.context);

    return options;

  }));

  // Start GraphiQL if enabled
  if (config.graphiql) {
    graphQLServer.use(config.graphiqlPath, graphiqlExpress(_.extend(config.graphiqlOptions, {endpointURL : config.path})));
  }

  // This binds the specified paths to the Express server running Apollo + GraphiQL
  WebApp.connectHandlers.use(Meteor.bindEnvironment(graphQLServer));
};

// end of main-client from apollostack/meteor-integration
// -------