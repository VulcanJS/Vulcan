import Newsletters from '../modules/collection.js';
import Users from 'meteor/vulcan:users';
import { addGraphQLMutation, addGraphQLResolvers, Utils, Connectors } from 'meteor/vulcan:core';

addGraphQLMutation('sendNewsletter : JSON');
addGraphQLMutation('testNewsletter : JSON');
addGraphQLMutation('addUserNewsletter(userId: String) : JSON');
addGraphQLMutation('addEmailNewsletter(email: String) : JSON');
addGraphQLMutation('removeUserNewsletter(userId: String) : JSON');

const resolver = {
  Mutation: {
    async sendNewsletter(root, args, context) {
      if(context.currentUser && Users.isAdminById(context.currentUser._id)) {
        return await Newsletters.send();
      } else {
        throw new Error(Utils.encodeIntlError({id: 'app.noPermission'}));
      }
    },
    async testNewsletter(root, args, context) {
      if(context.currentUser && Users.isAdminById(context.currentUser._id)) 
        return await Newsletters.send(true);
    },
    async addUserNewsletter(root, {userId}, context) {

      const currentUser = context.currentUser;
      const user = await Connectors.get(Users, userId);
      if (!user || !Users.options.mutations.edit.check(currentUser, user)) {
        throw new Error(Utils.encodeIntlError({id: 'app.noPermission'}));
      }
      return await Newsletters.subscribeUser(user, false);
    },
    async addEmailNewsletter(root, {email}, context) {
      return await Newsletters.subscribeEmail(email, true);
    },
    async removeUserNewsletter(root, { userId }, context) {
      const currentUser = context.currentUser;
      const user = await Connectors.get(Users, userId);
      if (!user || !Users.options.mutations.edit.check(currentUser, user)) {
        throw new Error(Utils.encodeIntlError({id: 'app.noPermission'}));
      }
      
      try {
        return await Newsletters.unsubscribeUser(user);
      } catch (error) {
        const errorMessage = error.message.includes('subscription-failed') ? Utils.encodeIntlError({id: 'newsletter.subscription_failed'}) : error.message;
        throw new Error(errorMessage);
      }
    },
  },
};
addGraphQLResolvers(resolver);
