import Newsletter from "../namespace.js";
import MailChimpList from "./mailchimp/mailchimp_list.js";
import Users from 'meteor/nova:users';
import { GraphQLSchema } from 'meteor/nova:core';

GraphQLSchema.addMutation('sendNewsletter : JSON');
GraphQLSchema.addMutation('testNewsletter : JSON');
GraphQLSchema.addMutation('addUserNewsletter(userId: String) : JSON');
GraphQLSchema.addMutation('addEmailNewsletter(email: String) : JSON');
GraphQLSchema.addMutation('removeUserNewsletter(userId: String) : JSON');

const resolver = {
  Mutation: {
    sendNewsletter(root, args, context) {
      if(context.currentUser && Users.isAdminById(context.currentUser._id)) {
        return Newsletter.scheduleNextWithMailChimp(false);
      } else {
        return {error: `You don't have the rights to do this.`}
      }
    },
    testNewsletter(root, args, context) {
      if(context.currentUser && Users.isAdminById(context.currentUser._id)) 
        return Newsletter.scheduleNextWithMailChimp(true);
    },
    addUserNewsletter(root, args, context) {

      const currentUser = context.currentUser;
      const user = Users.findOne({_id: args.userId});
      if (!user || !Users.options.mutations.edit.check(currentUser, user)) {
        throw new Error(601, 'sorry_you_cannot_edit_this_user');
      }
      try {
        return MailChimpList.add(user, false);
      } catch (error) {
        throw new Error(500, error.message);
      }
    },
    addEmailNewsletter(root, {email}, context) {
      try {
        return MailChimpList.add(email, true);
      } catch (error) {
        throw new Error(500, error.message);
      }
    },
    removeUserNewsletter(root, { userId }, context) {
      const currentUser = context.currentUser;
      const user = Users.findOne({_id: userId});
      if (!user || !Users.options.mutations.edit.check(currentUser, user)) {
        throw new Error(601, 'sorry_you_cannot_edit_this_user');
      }
      
      try {
        return MailChimpList.remove(user);
      } catch (error) {
        throw new Error(500, error.message);
      }
    },
  },
};
GraphQLSchema.addResolvers(resolver);

