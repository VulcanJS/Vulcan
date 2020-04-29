import Users from 'meteor/vulcan:users';
import { addGraphQLSchema, addGraphQLMutation, addGraphQLResolvers, Connectors } from 'meteor/vulcan:core';
import { subscribeUser, subscribeEmail, send, unsubscribeUser } from './newsletters';

export const sendNewsletter = async (root, { newsletterId }, context) => {
  if (Users.isAdmin(context.currentUser)) {
    const response = await send({ newsletterId });
    return response;
  } else {
    throw new Error({ id: 'app.noPermission' });
  }
};

export const testNewsletter = async (root, { newsletterId }, context) => {
  if (Users.isAdmin(context.currentUser)) {
    const response = await send({ newsletterId, isTest: true });
    return response;
  } else {
    throw new Error({ id: 'app.noPermission' });
  }
};

export const addUserNewsletter = async (root, { userId }, context) => {
  const currentUser = context.currentUser;
  const user = await Connectors.get(Users, userId);
  if (!user || !Users.options.mutations.edit.check(currentUser, user, context)) {
    throw new Error({ id: 'app.noPermission' });
  }
  return await subscribeUser(user, false);
};

export const addEmailNewsletter = async (root, { email }, context) => {
  return await subscribeEmail(email, true);
};

export const removeUserNewsletter = async (root, { userId }, context) => {
  const currentUser = context.currentUser;
  const user = await Connectors.get(Users, userId);
  if (!user || !Users.options.mutations.edit.check(currentUser, user, context)) {
    throw new Error({ id: 'app.noPermission' });
  }

  try {
    return await unsubscribeUser(user);
  } catch (error) {
    const errorMessage = error.message.includes('subscription-failed') ? { id: 'newsletter.subscription_failed' } : error.message;
    throw new Error(errorMessage);
  }
};

export const addNewsletterMutations = () => {

  const newsletterResponseSchema = `type NewsletterResponse {
    email: String
    success: JSON
    error: String
  }`;
  addGraphQLSchema(newsletterResponseSchema);

  addGraphQLMutation('sendNewsletter(newsletterId: String) : Newsletter');
  addGraphQLMutation('testNewsletter(newsletterId: String) : Newsletter');
  addGraphQLMutation('addUserNewsletter(userId: String) : NewsletterResponse');
  addGraphQLMutation('addEmailNewsletter(email: String) : NewsletterResponse');
  addGraphQLMutation('removeUserNewsletter(userId: String) : NewsletterResponse');

  const resolver = {
    Mutation: {
      sendNewsletter,
      testNewsletter,
      addUserNewsletter,
      addEmailNewsletter,
      removeUserNewsletter,
    },
  };

  addGraphQLResolvers(resolver);
};
