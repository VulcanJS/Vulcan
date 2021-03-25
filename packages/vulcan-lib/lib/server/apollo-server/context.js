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
import { GraphQLSchema } from '../graphql/index.js';
import _merge from 'lodash/merge';
import { getHeaderLocale } from '../intl.js';
import { getLocale } from '../../modules/intl.js';
import { getSetting } from '../../modules/settings.js';
import { WebApp } from 'meteor/webapp';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';



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

  // add all collections to context
  Collections.forEach(c => (context[c.collectionName] = c));

  // merge with custom context
  // TODO: deepmerge created an infinite loop here
  context = _merge({}, context, GraphQLSchema.context);
  return context;
};

import Cookies from 'universal-cookie';

// initial request will get the login token from a cookie, subsequent requests from
// the header
export const getAuthToken = req => {
  return req.headers.authorization || new Cookies(req.cookies).get('meteor_login_token');
};

const getUser = async loginToken => {
  if (loginToken) {
    check(loginToken, String)

    const hashedToken = Accounts._hashLoginToken(loginToken)

    const user = await Meteor.users.rawCollection().findOne({
      'services.resume.loginTokens.hashedToken': hashedToken
    })

    if (user) {
      // find the right login token corresponding, the current user may have
      // several sessions logged on different browsers / computers
      const tokenInformation = user.services.resume.loginTokens.find(
        tokenInfo => tokenInfo.hashedToken === hashedToken
      )

      const expiresAt = Accounts._tokenExpiration(tokenInformation.when)

      const isExpired = expiresAt < new Date()

      if (!isExpired) {
        return user
      }
    }
  }
}

// @see https://www.apollographql.com/docs/react/recipes/meteor#Server
export const setupAuthToken = async (context, req) => {
  const authToken = getAuthToken(req);
  const user = await getUser(authToken);
  if (user) {
    context.userId = user._id;
    context.currentUser = user;
    // Not useful
    //context.authToken = authToken;
    // identify user to any server-side analytics providers
    runCallbacks('events.identify', user);
  } else {
    context.userId = undefined;
    context.currentUser = undefined;
  }
};

// @see https://github.com/facebook/dataloader#caching-per-request
const generateDataLoaders = context => {
  // go over context and add Dataloader to each collection
  Collections.forEach(collection => {
    context[collection.options.collectionName].loader = new DataLoader(ids => findByIds(collection, ids, context), {
      cache: true,
    });
  });
  return context;
};

// Returns a function called on every request to compute context
export const computeContextFromReq = (currentContext, customContextFromReq) => {
  // givenOptions can be either a function of the request or an object
  const getBaseContext = req => (customContextFromReq ? { ...currentContext, ...customContextFromReq(req) } : { ...currentContext });

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
    // pass the whole req for advanced usage, like fetching IP from connection
    context.req = req;

    // if apiKey is present, assign "fake" currentUser with admin rights
    if (headers.apikey && headers.apikey === getSetting('vulcan.apiKey')) {
      context.currentUser = { isAdmin: true, isApiUser: true };
    }

    context.locale = getHeaderLocale(headers, context.currentUser && context.currentUser.locale);
    const locale = getLocale(context.locale);

    // see https://forums.meteor.com/t/can-i-edit-html-tag-in-meteor/5867/7
    WebApp.addHtmlAttributeHook(function() {
      let htmlAttributes = {
        lang: context.locale
      };
      if (locale?.rtl === true) {
        htmlAttributes.class = 'rtl';
      } else {
        htmlAttributes.class = 'ltr';
      }
      return htmlAttributes;
    });

    context = await runCallbacks({ name: 'graphql.context', iterator: context });

    return context;
  };

  return handleReq;
};
