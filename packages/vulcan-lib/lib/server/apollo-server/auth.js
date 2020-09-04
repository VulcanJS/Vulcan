import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import Cookies from 'universal-cookie';
import { makeOneGraphJwtVerifier } from '@sgrove/onegraph-apollo-server-auth';
import { getSetting } from '../../modules/settings.js';
import get from 'lodash/get';

/* -------------------- Meteor -------------------- */

/*

Look for Meteor auth token in two places

*/
export const getMeteorAuthToken = req => req.headers.authorization || new Cookies(req.cookies).get('meteor_login_token');

/*

Get user based on Meteor token

*/
export const getMeteorUser = async loginToken => {
  if (loginToken) {
    check(loginToken, String);

    const hashedToken = Accounts._hashLoginToken(loginToken);

    const user = await Meteor.users.rawCollection().findOne({
      'services.resume.loginTokens.hashedToken': hashedToken,
    });

    if (user) {
      // find the right login token corresponding, the current user may have
      // several sessions logged on different browsers / computers
      const tokenInformation = user.services.resume.loginTokens.find(tokenInfo => tokenInfo.hashedToken === hashedToken);

      const expiresAt = Accounts._tokenExpiration(tokenInformation.when);

      const isExpired = expiresAt < new Date();

      if (!isExpired) {
        return user;
      }
    }
  }
};

/* -------------------- OneGraph -------------------- */

// OneGraph configuration
const ONEGRAPH_APP_ID = getSetting('oneGraph.appId');

// 1. Find your APP_ID by logging into the OneGraph dashboard
const verifyJwtFromHeaders = makeOneGraphJwtVerifier(ONEGRAPH_APP_ID, {
  // Advanced usage: Uncomment this line if you want to allow shared-secret JWTs.
  // This is optional, as by default OneGraph will use public/private signatures.
  // sharedSecret: "passwordpasswordpasswordpasswo
  // rdpasswordpasswordpasswordpasswordpassword"
});

/*

Look for OneGraph auth token in two places

*/
export const getOneGraphAuthToken = req => req.headers.authorization_og || new Cookies(req.cookies).get('og_auth_token');

/*

Take a req and return the decoded object

*/
export const verifyAndDecodeAuthToken = async req => {
  let jwtContext;

  // Extract and verify the JWT using OneGraph's helper function
  try {
    jwtContext = await verifyJwtFromHeaders(req.headers);
  } catch (e) {
    throw new Error(e);
  }
  return jwtContext;
};

/*

Get user based on OneGraph token

*/
export const getOneGraphUser = async authToken => {
  let user;
  const dummyReq = {
    headers: {
      Authorization: 'Bearer ' + authToken,
    },
  };
  const decoded = await verifyAndDecodeAuthToken(dummyReq);
  // eslint-disable-next-line
  console.log('Decoded auth token:', decoded);
  const twitterId = get(decoded, 'user.twitterId');
  if (twitterId) {
    user = await Meteor.users.rawCollection().findOne({
      'services.twitter.id': twitterId,
    });
  }
  return user;
};

/* -------------------- Commong -------------------- */

/*

Get current authenticated user based on a req object

*/
export const getCurrentUserFromReq = async req => {
  let user;
  const meteorAuthToken = getMeteorAuthToken(req);
  const ogAuthToken = getOneGraphAuthToken(req);
  console.log('meteorAuthToken: ' + meteorAuthToken);
  console.log('ogAuthToken: ' + ogAuthToken);
  if (meteorAuthToken) {
    user = await getMeteorUser(meteorAuthToken);
  } else if (ogAuthToken) {
    user = await getOneGraphUser(meteorAuthToken);
  }
  console.log('// found user: ')
  console.log(user)
  return user;
};
