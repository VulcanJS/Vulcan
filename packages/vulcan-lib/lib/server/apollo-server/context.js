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
import {getSetting} from '../../modules/settings.js';
import {Collections} from '../../modules/collections.js';
import {runCallbacks} from '../../modules/callbacks.js';
import findByIds from '../../modules/findbyids.js';
import {GraphQLSchema} from '../../modules/graphql.js';
import _merge from 'lodash/merge';
import {getUser} from 'meteor/apollo';

/**
 * Called once on server creation
 * @param {*} currentContext
 */
export const initContext = currentContext => {
  let context;
  if (currentContext) {
    context = {...currentContext};
  } else {
    context = {};
  }
  // merge with custom context
  // TODO: deepmerge created an infinite loop here
  context = _merge({}, context, GraphQLSchema.context);
  // go over context and add Dataloader to each collection
  Collections.forEach(collection => {
    context[collection.options.collectionName].loader = new DataLoader(
      ids => findByIds(collection, ids, context),
      {
        cache: true,
      }
    );
  });
  return context;
};

import Cookies from 'universal-cookie';

// initial request will get the login token from a cookie, subsequent requests from
// the header
const getAuthToken = req => {
  return (
    req.headers.authorization ||
    new Cookies(req.cookies).get('meteor_login_token')
  );
};
// @see https://www.apollographql.com/docs/react/recipes/meteor#Server
const setupAuthToken = async (context, req) => {
  const user = await getUser(getAuthToken(req));
  if (user) {
    context.userId = user._id;
    context.currentUser = user;
    // identify user to any server-side analytics providers
    runCallbacks('events.identify', user);
  } else {
    context.userId = undefined;
    context.currentUser = undefined;
  }
};
// Returns a function called on every request to compute context
export const computeContextFromReq = (currentContext, customContextFromReq) => {
  // givenOptions can be either a function of the request or an object
  const getBaseContext = req =>
    customContextFromReq
      ? {...currentContext, ...customContextFromReq(req)}
      : {...currentContext};
  // Previous implementation
  // Now meteor/apollo already provide this
  // Get the token from the header
  //let user = null
  //if (req.headers.authorization) {
  //  const token = req.headers.authorization;
  //  check(token, String);
  //  const hashedToken = _hashLoginToken(token);
  //
  //      // Get the user from the database
  //      user = await Meteor.users.findOne({ 'services.resume.loginTokens.hashedToken': hashedToken });
  //
  //      if (user) {
  //        // identify user to any server-side analytics providers
  //        runCallbacks('events.identify', user);
  //
  //        const loginToken = Utils.findWhere(user.services.resume.loginTokens, { hashedToken });
  //        const expiresAt = _tokenExpiration(loginToken.when);
  //        const isExpired = expiresAt < new Date();
  //
  //        if (!isExpired) {
  //          context.userId = user._id;
  //          context.currentUser = user;
  //        }
  //      }
  //}

  // create options given the current request
  const handleReq = async req => {
    let context;
    let user = null;

    context = getBaseContext(req);

    // note: custom default resolver doesn't currently work
    // see https://github.com/apollographql/apollo-server/issues/716
    // options.fieldResolver = (source, args, context, info) => {
    //   return source[info.fieldName];
    // }

    await setupAuthToken(context, req);

    //add the headers to the context
    context.headers = req.headers;

    // console.log('// apollo_server.js user-agent:', req.headers['user-agent']);
    // console.log('// apollo_server.js locale:', req.headers.locale);

    context.locale =
      (user && user.locale) || req.headers.locale || getSetting('locale', 'en');

    return context;
  };

  return handleReq;
};
