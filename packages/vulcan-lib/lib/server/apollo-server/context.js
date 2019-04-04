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
import { Collections } from '../../modules/collections.js';
import { runCallbacks } from '../../modules/callbacks.js';
import findByIds from '../../modules/findbyids.js';
import { GraphQLSchema } from '../../modules/graphql';
import _merge from 'lodash/merge';
import { getUser } from 'meteor/apollo';
import { getHeaderLocale } from '../intl.js';
import { getSetting } from '../../modules/settings.js';

/**
 * Called once on server creation
 * @param {*} currentContext
 */
export const initContext = currentContext => {
  let context;
  if (currentContext) {
    context = { ...currentContext };
  } else {
    context = {};
  }
  // merge with custom context
  // TODO: deepmerge created an infinite loop here
  context = _merge({}, context, GraphQLSchema.context);
  return context;
};

import Cookies from 'universal-cookie';

// initial request will get the login token from a cookie, subsequent requests from
// the header
const getAuthToken = req => {
  return req.headers.authorization || new Cookies(req.cookies).get('meteor_login_token');
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

// @see https://github.com/facebook/dataloader#caching-per-request
const generateDataLoaders = (context) => {
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


// Returns a function called on every request to compute context
export const computeContextFromReq = (currentContext, customContextFromReq) => {
  // givenOptions can be either a function of the request or an object
  const getBaseContext = req =>
    customContextFromReq
      ? { ...currentContext, ...customContextFromReq(req) }
      : { ...currentContext };

  // create options given the current request
  const handleReq = async req => {
    const { headers } = req;
    let context;

    // eslint-disable-next-line no-unused-vars
    let user = null;

    context = getBaseContext(req);

    generateDataLoaders(context);

    // note: custom default resolver doesn't currently work
    // see https://github.com/apollographql/apollo-server/issues/716
    // @options.fieldResolver = (source, args, context, info) => {
    //   return source[info.fieldName];
    // }

    await setupAuthToken(context, req);

    //add the headers to the context
    context.headers = headers;

    // if apiKey is present, assign "fake" currentUser with admin rights
    if (headers.apikey && headers.apikey === getSetting('vulcan.apiKey')) {
      context.currentUser = { isAdmin: true, isApiUser: true };
    }

    context.locale = getHeaderLocale(headers, context.currentUser && context.currentUser.locale);

    return context;
  };

  return handleReq;
};
