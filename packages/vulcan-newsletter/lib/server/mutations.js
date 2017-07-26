import Newsletters from "../modules/collection.js";
import Users from 'meteor/vulcan:users';
import { addGraphQLMutation, addGraphQLResolvers, Utils } from 'meteor/vulcan:core';

addGraphQLMutation('sendNewsletter : JSON');
addGraphQLMutation('testNewsletter : JSON');
addGraphQLMutation('addUserNewsletter(userId: String) : JSON');
addGraphQLMutation('addEmailNewsletter(email: String) : JSON');
addGraphQLMutation('removeUserNewsletter(userId: String) : JSON');

const resolver = {
  Mutation: {
    sendNewsletter(root, args, context) {
      if(context.currentUser && Users.isAdminById(context.currentUser._id)) {
        return Newsletters.send();
      } else {
        throw new Error(Utils.encodeIntlError({id: "app.noPermission"}));
      }
    },
    testNewsletter(root, args, context) {
      if(context.currentUser && Users.isAdminById(context.currentUser._id)) 
        return Newsletters.send(true);
    },
    addUserNewsletter(root, {userId}, context) {

      const currentUser = context.currentUser;
      const user = Users.findOne({_id: userId});
      if (!user || !Users.options.mutations.edit.check(currentUser, user)) {
        throw new Error(Utils.encodeIntlError({id: "app.noPermission"}));
      }
      return Newsletters.subscribeUser(user, false);
    },
    addEmailNewsletter(root, {email}, context) {
      return Newsletters.subscribeEmail(email, true);
    },
    removeUserNewsletter(root, { userId }, context) {
      const currentUser = context.currentUser;
      const user = Users.findOne({_id: userId});
      if (!user || !Users.options.mutations.edit.check(currentUser, user)) {
        throw new Error(Utils.encodeIntlError({id: "app.noPermission"}));
      }
      
      try {
        return Newsletters.unsubscribeUser(user);
      } catch (error) {
        const errorMessage = error.message.includes('subscription-failed') ? Utils.encodeIntlError({id: "newsletter.subscription_failed"}) : error.message
        throw new Error(errorMessage);
      }
    },
  },
};
addGraphQLResolvers(resolver);
