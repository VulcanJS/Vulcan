/**
 * Context prop of the ApolloServer config
 *
 * It sets up the server options based on the current request
 * Replacement to the syntax graphqlExpress(async req => {... })
 * Current pattern:
 * @see https://www.apollographql.com/docs/apollo-server/migration-two-dot.html#request-headers
 * @see https://github.com/apollographql/apollo-server/issues/1066
 * Previous implementation:
 * @see https://github.com/apollographql/apollo-server/issues/420
 */

import { formatError } from 'apollo-errors';
import deepmerge from 'deepmerge';
import DataLoader from 'dataloader';
import { getSetting } from '../../modules/settings.js';
import { _hashLoginToken, _tokenExpiration } from '../accounts_helpers';
import { Collections } from '../../modules/collections.js';
import { runCallbacks } from '../../modules/callbacks.js';
import findByIds from '../../modules/findbyids.js';
import { GraphQLSchema } from '../../modules/graphql.js';
import { defaultOptions } from './defaults';

const makeOptionsBuilder = givenOptions => {
  // givenOptions can be either a function of the request or an object
  const getGivenOptions = req => (typeof givenOptions === 'function' ? givenOptions(req) : givenOptions);
  const setupAuthToken = async (options, req) => {
    let user = null;
    // Get the token from the header
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      check(token, String);
      const hashedToken = _hashLoginToken(token);

      // Get the user from the database
      user = await Meteor.users.findOne({ 'services.resume.loginTokens.hashedToken': hashedToken });

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
  };
  // go over context and add Dataloader to each collection
  const setupDataLoader = options => {
    Collections.forEach(collection => {
      options.context[collection.options.collectionName].loader = new DataLoader(
        ids => findByIds(collection, ids, options.context),
        { cache: true }
      );
    });
  };

  // create options given the current request
  const handleContext = async ({ req }) => {
    let options;
    let user = null;

    options = getGivenOptions(req);
    // Merge in the defaults
    options = { ...defaultOptions, ...options };

    if (options.context) {
      // don't mutate the context provided in options
      options.context = { ...options.context };
    } else {
      options.context = {};
    }

    // enable tracing and caching
    options.tracing = getSetting('apolloTracing', Meteor.isDevelopment);
    options.cacheControl = true;

    // note: custom default resolver doesn't currently work
    // see https://github.com/apollographql/apollo-server/issues/716
    // options.fieldResolver = (source, args, context, info) => {
    //   return source[info.fieldName];
    // }

    setupAuthToken(options, req);

    //add the headers to the context
    options.context.headers = req.headers;

    // merge with custom context
    options.context = deepmerge(options.context, GraphQLSchema.context);

    setupDataLoader(options);

    // console.log('// apollo_server.js user-agent:', req.headers['user-agent']);
    // console.log('// apollo_server.js locale:', req.headers.locale);

    options.context.locale = (user && user.locale) || req.headers.locale || getSetting('locale', 'en');

    // add error formatting from apollo-errors
    options.formatError = formatError;

    return options;
  };

  return handleContext;
};

export default makeOptionsBuilder;
