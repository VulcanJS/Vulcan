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

//import deepmerge from 'deepmerge';
import DataLoader from 'dataloader';
import { getSetting } from '../../modules/settings.js';
import { _hashLoginToken, _tokenExpiration } from '../accounts_helpers';
import { Collections } from '../../modules/collections.js';
import { runCallbacks } from '../../modules/callbacks.js';
import findByIds from '../../modules/findbyids.js';
import { GraphQLSchema } from '../../modules/graphql.js';
import { Utils } from '../../modules/utils.js';
import _merge from 'lodash/merge';

const computeContext = (currentContext, contextFromReq) => {
  // givenOptions can be either a function of the request or an object
  const getBaseContext = req => (contextFromReq ? { ...currentContext, ...contextFromReq(req) } : currentContext);
  const setupAuthToken = async (context, req) => {
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
          context.userId = user._id;
          context.currentUser = user;
        }
      }
    }
  };
  // go over context and add Dataloader to each collection
  const setupDataLoader = context => {
    Collections.forEach(collection => {
      context[collection.options.collectionName].loader = new DataLoader(ids => findByIds(collection, ids, context), {
        cache: true
      });
    });
  };

  // create options given the current request
  const handleReq = async ({ req }) => {
    let context;
    let user = null;

    context = getBaseContext(req);

    if (context) {
      // don't mutate the context provided in options
      context = { ...context };
    } else {
      context = {};
    }

    // note: custom default resolver doesn't currently work
    // see https://github.com/apollographql/apollo-server/issues/716
    // options.fieldResolver = (source, args, context, info) => {
    //   return source[info.fieldName];
    // }

    await setupAuthToken(context, req);

    //add the headers to the context
    context.headers = req.headers;

    // merge with custom context
    // TODO: deemerge created an infinite loop here
    context = _merge({}, context, GraphQLSchema.context);

    setupDataLoader(context);

    // console.log('// apollo_server.js user-agent:', req.headers['user-agent']);
    // console.log('// apollo_server.js locale:', req.headers.locale);

    context.locale = (user && user.locale) || req.headers.locale || getSetting('locale', 'en');

    return context;
  };

  return handleReq;
};

export default computeContext;
