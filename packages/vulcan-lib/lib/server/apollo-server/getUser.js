import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

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